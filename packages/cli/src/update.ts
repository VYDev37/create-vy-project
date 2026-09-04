import path from "node:path";
import fs from "fs-extra";
import { spinner, note, cancel } from "@clack/prompts";
import { getResourceDirs } from "./scaffold.js";
import { skillMap } from "./skill-map.js";
import { generateAgentsMd } from "./agents.js";

/**
 * Detects active stacks in an existing project.
 * Checks AGENTS.md first, then falls back to project file inspection.
 */
async function detectStacks(projectRoot: string): Promise<string[]> {
  const detectedStacks = new Set<string>();

  const agentsMdPath = path.join(projectRoot, "AGENTS.md");
  if (await fs.pathExists(agentsMdPath)) {
    const content = await fs.readFile(agentsMdPath, "utf-8");
    const activeStacksMatch = content.match(/## Active Stacks\s*\n([\s\S]*?)(?=\n##|$)/);
    if (activeStacksMatch) {
      const lines = activeStacksMatch[1].split("\n");
      for (const line of lines) {
        const match = line.match(/-\s*`([^`]+)`/);
        if (match) {
          const stackName = match[1].split(" ")[0].trim();
          if (stackName in skillMap || stackName === "go-fiber") {
            detectedStacks.add(stackName);
          }
        }
      }
    }
  }

  const hasBackendDir = await fs.pathExists(path.join(projectRoot, "backend"));
  const hasFrontendDir = await fs.pathExists(path.join(projectRoot, "frontend"));

  const rootGoMod = await fs.pathExists(path.join(projectRoot, "go.mod"));
  const backendGoMod = await fs.pathExists(path.join(projectRoot, "backend", "go.mod"));
  if (rootGoMod || backendGoMod) {
    detectedStacks.add("go-fiber");
  }

  const checkPkgJson = async (pkgPath: string) => {
    if (await fs.pathExists(pkgPath)) {
      try {
        const pkg = await fs.readJson(pkgPath);
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (allDeps.next) {
          if (hasBackendDir || rootGoMod) {
            detectedStacks.add("nextjs-frontend");
          } else {
            detectedStacks.add("nextjs-fullstack");
          }
        } else if (allDeps.vite || allDeps.react) {
          detectedStacks.add("react-vite");
        }
      } catch {
      }
    }
  };

  if (hasFrontendDir) {
    await checkPkgJson(path.join(projectRoot, "frontend", "package.json"));
  } else {
    await checkPkgJson(path.join(projectRoot, "package.json"));
  }

  return Array.from(detectedStacks);
}

/**
 * Updates instructions (AGENTS.md, CLAUDE.md) and skills (.agents/skills/)
 * in an existing project without touching any application source code.
 */
export async function updateProject(targetDir?: string) {
  const projectRoot = targetDir ? path.resolve(process.cwd(), targetDir) : process.cwd();

  if (!(await fs.pathExists(projectRoot))) {
    cancel(`Target directory does not exist: ${projectRoot}`);
    process.exit(1);
  }

  const s = spinner();
  s.start("Analyzing existing project and detecting active stacks...");

  const selectedStacks = await detectStacks(projectRoot);

  if (selectedStacks.length === 0) {
    s.stop("No supported stacks detected");
    cancel(
      `Could not determine active stacks in "${projectRoot}".\nEnsure you are running the update command inside a project scaffolded with create-vy-project.`
    );
    process.exit(1);
  }

  s.stop(`Detected stacks: ${selectedStacks.map((st) => `\`${st}\``).join(", ")}`);

  const { templatesDir, skillsDir } = getResourceDirs();
  const agentSkillsDir = path.join(projectRoot, ".agents", "skills");
  await fs.ensureDir(agentSkillsDir);

  s.start("Updating .agents/skills/ with the latest conventions and guidelines...");
  let updatedSkillFiles = 0;

  for (const stack of selectedStacks) {
    const skillFiles = skillMap[stack] || [];
    for (const relFile of skillFiles) {
      const srcSkillPath = path.join(skillsDir, relFile);
      const destSkillPath = path.join(agentSkillsDir, relFile);

      await fs.ensureDir(path.dirname(destSkillPath));
      if (await fs.pathExists(srcSkillPath)) {
        await fs.copy(srcSkillPath, destSkillPath, { overwrite: true });
        updatedSkillFiles++;
      }
    }
  }

  for (const stack of selectedStacks) {
    let templateFolder = stack;
    if (stack === "go-fiber") {
      const isSqlite =
        (await fs.pathExists(path.join(projectRoot, "sqlite.db"))) ||
        (await fs.pathExists(path.join(projectRoot, "backend", "sqlite.db")));
      templateFolder = isSqlite ? "go-fiber-sqlite" : "go-fiber";
    }

    const templateSkillsDir = path.join(templatesDir, templateFolder, ".agents", "skills");
    if (await fs.pathExists(templateSkillsDir)) {
      await fs.copy(templateSkillsDir, agentSkillsDir, { overwrite: true });
    }
  }
  s.stop(".agents/skills/ updated with latest skills");

  s.start("Updating AGENTS.md and CLAUDE.md instructions...");
  const agentsMdContent = generateAgentsMd(selectedStacks);
  await fs.writeFile(path.join(projectRoot, "AGENTS.md"), agentsMdContent, "utf-8");
  await fs.writeFile(path.join(projectRoot, "CLAUDE.md"), "@AGENTS.md\n", "utf-8");

  const hasBackend = await fs.pathExists(path.join(projectRoot, "backend"));
  const hasFrontend = await fs.pathExists(path.join(projectRoot, "frontend"));

  if (hasBackend && selectedStacks.includes("go-fiber")) {
    const backendDir = path.join(projectRoot, "backend");
    const isSqlite = await fs.pathExists(path.join(backendDir, "sqlite.db"));
    const tmplFolder = isSqlite ? "go-fiber-sqlite" : "go-fiber";
    const srcTmplAgents = path.join(templatesDir, tmplFolder, "AGENTS.md");
    if (await fs.pathExists(srcTmplAgents)) {
      await fs.copy(srcTmplAgents, path.join(backendDir, "AGENTS.md"), { overwrite: true });
      await fs.writeFile(path.join(backendDir, "CLAUDE.md"), "@AGENTS.md\n", "utf-8");
    }
  }

  if (hasFrontend) {
    const frontendDir = path.join(projectRoot, "frontend");
    const feStack = selectedStacks.find((s) => s.startsWith("nextjs") || s === "react-vite");
    if (feStack) {
      const srcTmplAgents = path.join(templatesDir, feStack, "AGENTS.md");
      if (await fs.pathExists(srcTmplAgents)) {
        await fs.copy(srcTmplAgents, path.join(frontendDir, "AGENTS.md"), { overwrite: true });
        await fs.writeFile(path.join(frontendDir, "CLAUDE.md"), "@AGENTS.md\n", "utf-8");
      }
    }
  }

  s.stop("Instructions updated successfully");

  note(
    `Updated files:\n- AGENTS.md (Root)\n- CLAUDE.md (Root)\n- .agents/skills/ (${updatedSkillFiles}+ skills synced)\n${hasBackend ? "- backend/AGENTS.md & CLAUDE.md\n" : ""
    }${hasFrontend ? "- frontend/AGENTS.md & CLAUDE.md\n" : ""}\nApplication source code was left untouched.`,
    "Update Complete"
  );
}
