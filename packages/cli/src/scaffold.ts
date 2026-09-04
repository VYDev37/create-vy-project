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

export function getResourceDirs(): { templatesDir: string; skillsDir: string } {
  const possibleRoots = [
    path.resolve(__dirname, ".."), // Inside packages/cli
    path.resolve(__dirname, "../.."), // Inside packages/
    path.resolve(__dirname, "../../.."), // Monorepo root
    path.resolve(__dirname, "."),
    process.cwd(),
  ];

  for (const root of possibleRoots) {
    const tDir = path.join(root, "templates");
    const sDir = path.join(root, "skills");
    if (fs.existsSync(tDir) && fs.existsSync(sDir)) {
      return { templatesDir: tDir, skillsDir: sDir };
    }
  }

  return {
    templatesDir: path.resolve(__dirname, "../templates"),
    skillsDir: path.resolve(__dirname, "../skills"),
  };
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
      content = content.replaceAll("go-fiber-sqlite", moduleName);
      content = content.replaceAll("go-fiber", moduleName);
      await fs.writeFile(fullPath, content, "utf-8");
    }
  }
}

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export function getPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent;
  if (!userAgent) return "pnpm";

  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("yarn")) return "yarn";
  if (userAgent.startsWith("bun")) return "bun";
  if (userAgent.startsWith("npm")) return "npm";

  return "pnpm";
}

function getInstallCmd(pkg: PackageManager): string {
  switch (pkg) {
    case "npm":
      return "npm install";
    case "yarn":
      return "yarn install";
    case "bun":
      return "bun install";
    case "pnpm":
    default:
      return "pnpm install";
  }
}

function getRunCmd(pkg: PackageManager, script: string): string {
  switch (pkg) {
    case "npm":
      return `npm run ${script}`;
    case "yarn":
      return `yarn ${script}`;
    case "bun":
      return `bun run ${script}`;
    case "pnpm":
    default:
      return `pnpm ${script}`;
  }
}

export async function scaffold(answers: Answers) {
  const { projectName, isCurrentDir, type, backend, frontend, database, username } = answers;
  const projectRoot = isCurrentDir ? process.cwd() : path.resolve(process.cwd(), projectName);
  const effectiveProjectName = path.basename(projectRoot);
  const { templatesDir, skillsDir } = getResourceDirs();

  const s = spinner();

  // 1. Create project root folder if not current dir
  await fs.ensureDir(projectRoot);

  const isCombo = type === "frontend+backend";
  const selectedStacks: string[] = [];

  // 2. Handle Backend (Go Fiber)
  if (backend === "go-fiber") {
    selectedStacks.push("go-fiber");
    const backendDest = isCombo ? path.join(projectRoot, "backend") : projectRoot;
    const templateFolder = database === "sqlite" ? "go-fiber-sqlite" : "go-fiber";
    const templateSrc = path.join(templatesDir, templateFolder);
    const goModuleName = username
      ? `github.com/${username}/${effectiveProjectName}${isCombo ? "/backend" : ""}`
      : effectiveProjectName;

    s.start(`Copying Go Fiber template (${database === "sqlite" ? "SQLite" : "PostgreSQL"})...`);
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
  if (frontend === "nextjs-fullstack") {
    selectedStacks.push("nextjs-fullstack");
    const frontendDest = isCombo ? path.join(projectRoot, "frontend") : projectRoot;
    const templateFolder = database === "postgres" ? "nextjs-fullstack-psql" : "nextjs-fullstack";
    const templateSrc = path.join(templatesDir, templateFolder);

    s.start(`Copying Next.js Fullstack template (${database === "postgres" ? "PostgreSQL" : "SQLite"})...`);
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
      pkg.name = effectiveProjectName;
      await fs.writeJson(pkgJsonPath, pkg, { spaces: 2 });
    }
    s.stop(`Next.js Fullstack template files copied and configured`);
  } else if (frontend === "nextjs-frontend") {
    selectedStacks.push("nextjs-frontend");
    const frontendDest = isCombo ? path.join(projectRoot, "frontend") : projectRoot;
    const templateSrc = path.join(templatesDir, "nextjs-frontend");

    s.start(`Copying Next.js Frontend template...`);
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
      pkg.name = effectiveProjectName;
      await fs.writeJson(pkgJsonPath, pkg, { spaces: 2 });
    }
    s.stop(`Next.js Frontend template files copied and configured`);
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
      pkg.name = effectiveProjectName;
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

  const pkgManager = getPackageManager();
  const installCmd = getInstallCmd(pkgManager);
  const devCmd = getRunCmd(pkgManager, "dev");

  let nextSteps = "";
  if (isCombo) {
    const bePath = isCurrentDir ? "backend" : `${projectName}/backend`;
    const fePath = isCurrentDir ? "frontend" : `${projectName}/frontend`;
    const dbLabel = database === "sqlite" ? "SQLite" : "PostgreSQL";
    nextSteps = `1. Backend (Go Fiber + ${dbLabel}):
   cd ${bePath}
   go run ./internal/scripts/auto_migrate.go
   go run ./cmd/main.go

2. Frontend:
   cd ${fePath}
   ${installCmd}
   ${devCmd}`;
  } else if (frontend === "nextjs-fullstack") {
    const cdCmd = isCurrentDir ? "" : `cd ${projectName}\n`;
    const dbLabel = database === "postgres" ? "PostgreSQL" : "local SQLite";
    nextSteps = `${cdCmd}${installCmd}
${getRunCmd(pkgManager, "db:push")}
${getRunCmd(pkgManager, "db:seed")}
${devCmd}

Database commands:
  ${getRunCmd(pkgManager, "db:push")}     (sync schema changes to ${dbLabel})
  ${getRunCmd(pkgManager, "db:seed")}     (seed default demo account)
  ${getRunCmd(pkgManager, "db:studio")}   (open Drizzle visual database viewer)
  ${getRunCmd(pkgManager, "db:migrate")}  (apply migrations)`;
  } else if (backend === "go-fiber") {
    const cdCmd = isCurrentDir ? "" : `cd ${projectName}\n`;
    nextSteps = `${cdCmd}go run ./internal/scripts/auto_migrate.go
go run ./cmd/main.go`;
  } else if (frontend) {
    const cdCmd = isCurrentDir ? "" : `cd ${projectName}\n`;
    nextSteps = `${cdCmd}${installCmd}
${devCmd}`;
  }

  nextSteps += "\nWarning: Don't forget to edit the .env file.\n";

  note(nextSteps, "Next steps to run your project:");
}
