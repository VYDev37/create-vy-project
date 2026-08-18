#!/usr/bin/env node
import { intro, outro } from "@clack/prompts";
import { runPrompts } from "./prompts.js";
import { scaffold } from "./scaffold.js";

async function main() {
  intro("create-vy-project");
  const answers = await runPrompts();
  await scaffold(answers);
  outro("Project ready! 🚀");
}

main().catch((err) => {
  console.error("Error creating project:", err);
  process.exit(1);
});
