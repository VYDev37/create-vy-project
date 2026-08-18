#!/usr/bin/env node
import { intro, outro } from "@clack/prompts";
import { runPrompts } from "./prompts.js";
import { scaffold } from "./scaffold.js";

async function main() {
  intro("create-vy-project");
  const targetArg = process.argv[2];
  const answers = await runPrompts(targetArg);
  await scaffold(answers);
  outro("Project ready! 🚀");
}

main().catch((err) => {
  console.error("Error creating project:", err);
  process.exit(1);
});
