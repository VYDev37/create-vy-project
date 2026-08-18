import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { execa } from "execa";
import { spinner, note } from "@clack/prompts";
import { Answers } from "./prompts.js";
import { skillMap } from "./skill-map.js";
import { generateAgentsMd } from "./agents.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getMonorepoRoot(): string {
  const possibleRoots = [
    path.resolve(__dirname, "../../.."),
    path.resolve(__dirname, "../.."),
    path.resolve(__dirname, ".."),
    process.cwd(),
  ];

  for (const root of possibleRoots) {
    if (fs.existsSync(path.join(root, "templates")) || fs.existsSync(path.join(root, "skills"))) {
      return root;
    }
  }

  return process.cwd();
}

/**
 * Replaces module placeholder in go.mod and all Go files in a directory.
 */
async function replaceGoModulePaths(dir: string, moduleName: string) {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      await replaceGoModulePaths(fullPath, moduleName);
    } else if (file.endsWith(".go") || file === "go.mod") {
      let content = await fs.readFile(fullPath, "utf-8");
      content = content.replaceAll("go-fiber-template", moduleName);
      content = content.replaceAll("go-fiber", moduleName);
      await fs.writeFile(fullPath, content, "utf-8");
    }
  }
}

export async function scaffold(answers: Answers) {
  const { projectName, type, backend, frontend, username } = answers;
  const projectRoot = path.resolve(process.cwd(), projectName);
  const monorepoRoot = getMonorepoRoot();
  const templatesDir = path.join(monorepoRoot, "templates");
  const skillsDir = path.join(monorepoRoot, "skills");

  const s = spinner();

  // 1. Create project root folder
  await fs.ensureDir(projectRoot);

  const isCombo = type === "frontend+backend";
  const selectedStacks: string[] = [];

  // 2. Handle Backend (Go Fiber)
  if (backend === "go-fiber") {
    selectedStacks.push("go-fiber");
    const backendDest = isCombo ? path.join(projectRoot, "backend") : projectRoot;
    const templateSrc = path.join(templatesDir, "go-fiber");
    const goModuleName = username
      ? `github.com/${username}/${projectName}${isCombo ? "/backend" : ""}`
      : projectName;

    s.start(`Copying Go Fiber template...`);
    await fs.ensureDir(backendDest);
    await fs.copy(templateSrc, backendDest, {
      filter: (src) => {
        const basename = path.basename(src);
        return basename !== "node_modules" && !basename.endsWith(".db") && !basename.endsWith(".db-journal");
      },
    });

    // Create .env from .env.example
    const envExamplePath = path.join(backendDest, ".env.example");
    const envPath = path.join(backendDest, ".env");
    if ((await fs.pathExists(envExamplePath)) && !(await fs.pathExists(envPath))) {
      await fs.copy(envExamplePath, envPath);
    }

    // Replace module name in go.mod and .go files
    await replaceGoModulePaths(backendDest, goModuleName);
    s.stop(`Go Fiber template files copied and module name updated`);

    // Run go mod tidy to sync dependencies with the updated module name
    s.start(`Resolving and tidying Go dependencies...`);
    try {
      await execa("go", ["mod", "tidy"], { cwd: backendDest });
      s.stop(`Go dependencies resolved`);
    } catch (err: unknown) {
      s.stop(`Note: go mod tidy skipped or failed`);
      console.warn("Notice:", err instanceof Error ? err.message : String(err));
    }
  }

  // 3. Handle Frontend
  if (frontend === "nextjs-fullstack" || frontend === "nextjs-frontend") {
    selectedStacks.push(frontend);
    const frontendDest = isCombo ? path.join(projectRoot, "frontend") : projectRoot;
    const templateSrc = path.join(templatesDir, frontend);

    s.start(`Copying Next.js template (${frontend})...`);
    await fs.ensureDir(frontendDest);
    await fs.copy(templateSrc, frontendDest, {
      filter: (src) => {
        const basename = path.basename(src);
        return (
          basename !== "node_modules" &&
          basename !== ".next" &&
          basename !== "dist" &&
          basename !== "pnpm-lock.yaml" &&
          !basename.endsWith(".db") &&
          !basename.endsWith(".db-journal")
        );
      },
    });

    // Create .env from .env.example
    const envExamplePath = path.join(frontendDest, ".env.example");
    const envPath = path.join(frontendDest, ".env");
    if ((await fs.pathExists(envExamplePath)) && !(await fs.pathExists(envPath))) {
      await fs.copy(envExamplePath, envPath);
    }

    // Update package.json name
    const pkgJsonPath = path.join(frontendDest, "package.json");
    if (await fs.pathExists(pkgJsonPath)) {
      const pkg = await fs.readJson(pkgJsonPath);
      pkg.name = projectName;
      await fs.writeJson(pkgJsonPath, pkg, { spaces: 2 });
    }
    s.stop(`Next.js template files copied and configured`);
  } else if (frontend === "react-vite") {
    selectedStacks.push("react-vite");
    const frontendDest = isCombo ? path.join(projectRoot, "frontend") : projectRoot;
    const templateSrc = path.join(templatesDir, "react-vite");

    s.start(`Copying React Vite template...`);
    await fs.ensureDir(frontendDest);
    await fs.copy(templateSrc, frontendDest, {
      filter: (src) => {
        const basename = path.basename(src);
        return (
          basename !== "node_modules" &&
          basename !== "dist" &&
          basename !== "pnpm-lock.yaml"
        );
      },
    });

    // Create .env from .env.example
    const envExamplePath = path.join(frontendDest, ".env.example");
    const envPath = path.join(frontendDest, ".env");
    if ((await fs.pathExists(envExamplePath)) && !(await fs.pathExists(envPath))) {
      await fs.copy(envExamplePath, envPath);
    }

    // Update package.json name
    const pkgJsonPath = path.join(frontendDest, "package.json");
    if (await fs.pathExists(pkgJsonPath)) {
      const pkg = await fs.readJson(pkgJsonPath);
      pkg.name = projectName;
      await fs.writeJson(pkgJsonPath, pkg, { spaces: 2 });
    }
    s.stop(`React Vite template files copied and configured`);
  }

  // 4. Create .agents/skills/ folder & copy relevant skills
  s.start("Setting up .agents/skills/ and AGENTS.md...");
  const agentSkillsDir = path.join(projectRoot, ".agents", "skills");
  await fs.ensureDir(agentSkillsDir);

  for (const stack of selectedStacks) {
    const skillFiles = skillMap[stack] || [];
    for (const relFile of skillFiles) {
      const srcSkillPath = path.join(skillsDir, relFile);
      const destSkillPath = path.join(agentSkillsDir, relFile);

      await fs.ensureDir(path.dirname(destSkillPath));
      if (await fs.pathExists(srcSkillPath)) {
        await fs.copy(srcSkillPath, destSkillPath);
      } else {
        await fs.writeFile(
          destSkillPath,
          `# ${path.basename(relFile, ".md")}\n\nConventions and standards for ${stack}.\n`,
          "utf-8"
        );
      }
    }
  }

  const agentsMdContent = generateAgentsMd(selectedStacks);
  await fs.writeFile(path.join(projectRoot, "AGENTS.md"), agentsMdContent, "utf-8");
  s.stop(".agents/skills/ and AGENTS.md configured");

  let nextSteps = "";
  if (isCombo) {
    nextSteps = `1. Backend (Go Fiber):
   cd ${projectName}/backend
   go run ./internal/scripts/auto_migrate.go
   go run ./cmd/main.go

2. Frontend:
   cd ${projectName}/frontend
   pnpm install
   pnpm dev`;
  } else if (frontend === "nextjs-fullstack") {
    nextSteps = `cd ${projectName}
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev

Database commands:
  pnpm db:push     (sync schema changes to local SQLite)
  pnpm db:seed     (seed default demo account)
  pnpm db:studio   (open Drizzle visual database viewer)
  pnpm db:migrate  (apply migrations)`;
  } else if (backend === "go-fiber") {
    nextSteps = `cd ${projectName}
go run ./internal/scripts/auto_migrate.go
go run ./cmd/main.go`;
  } else if (frontend) {
    nextSteps = `cd ${projectName}
pnpm install
pnpm dev`;
  }

  note(nextSteps, "Next steps to run your project:");
}
