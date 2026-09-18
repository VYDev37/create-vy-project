import { Client, GatewayIntentBits } from "discord.js";
import { ready, interactionCreate } from "@/listeners";
import { BOT_TOKEN } from "@/config";

console.log("🚀 Starting Discord Bot client...");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

ready(client);
interactionCreate(client);

client
  .login(BOT_TOKEN)
  .then(() => {
    console.log("🔑 Authenticated successfully with Discord Gateway.");
  })
  .catch((error) => {
    console.error("❌ Failed to login to Discord:", error);
    process.exit(1);
  });

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});
