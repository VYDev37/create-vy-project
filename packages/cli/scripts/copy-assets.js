import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(pkgRoot, "../..");

const srcTemplates = path.join(repoRoot, "templates");
const destTemplates = path.join(pkgRoot, "templates");

const srcSkills = path.join(repoRoot, "skills");
const destSkills = path.join(pkgRoot, "skills");

async function renameGitignores(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await renameGitignores(fullPath);
    } else if (entry.name === ".gitignore") {
      // Copy as _gitignore so npm pack/publish doesn't strip or rename it to .npmignore
      await fs.copy(fullPath, path.join(dir, "_gitignore"));
    }
  }
}

async function copyAssets() {
  console.log("Syncing templates and skills into CLI package...");

  // Sync templates
  if (await fs.pathExists(srcTemplates)) {
    await fs.remove(destTemplates);
    await fs.copy(srcTemplates, destTemplates, {
      filter: (src) => {
        const basename = path.basename(src);
        if (basename === ".env.example") {
          return true;
        }
        return (
          basename !== "node_modules" &&
          basename !== ".next" &&
          basename !== "dist" &&
          basename !== ".git" &&
          basename !== "pnpm-lock.yaml" &&
          basename !== "bun.lock" &&
          basename !== "package-lock.json" &&
          basename !== ".env" &&
          basename !== ".env.local" &&
          !basename.endsWith(".db") &&
          !basename.endsWith(".db-journal")
        );
      },
    });

    await renameGitignores(destTemplates);
    console.log("✓ Templates bundled successfully (with _gitignore and .env.example preserved)");
  }

  // Sync skills
  if (await fs.pathExists(srcSkills)) {
    await fs.remove(destSkills);
    await fs.copy(srcSkills, destSkills);
    console.log("✓ Skills bundled successfully");
  }
}

copyAssets().catch((err) => {
  console.error("Asset copying failed:", err);
  process.exit(1);
});
