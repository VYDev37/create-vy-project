#!/usr/bin/env node
import { intro, outro } from "@clack/prompts";
import { runPrompts } from "./prompts.js";
import { scaffold } from "./scaffold.js";
import { updateProject } from "./update.js";

async function main() {
  const args = process.argv.slice(2);

  // 1. Help flag
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
create-vy-project - Modern Fullstack & Backend Scaffolding CLI

Usage:
  npx create-vy-project [project-name]       Create a new project
  npx create-vy-project update [target-dir]  Update instructions & skills in an existing project

Commands:
  update [target-dir]   Update AGENTS.md, CLAUDE.md, and .agents/skills/ in an existing
                        project with the latest conventions without modifying application code.

Options:
  -u, --update          Run the update command
  -h, --help            Display this help message
`);
    process.exit(0);
  }

  // 2. Update command
  const isUpdate = args[0] === "update" || args.includes("--update") || args.includes("-u");
  if (isUpdate) {
    intro("create-vy-project (update)");
    const targetDir = args[0] === "update" ? args[1] : args.find((a) => !a.startsWith("-"));
    await updateProject(targetDir);
    outro("Update complete! 🚀");
    return;
  }

  // 3. New project scaffolding
  intro("create-vy-project");
  const targetArg = args[0];
  const answers = await runPrompts(targetArg);
  await scaffold(answers);
  outro("Project ready! 🚀");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
