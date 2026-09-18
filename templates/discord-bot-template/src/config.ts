import "dotenv/config";

export interface Config {
  botToken: string;
  guildId?: string;
  environment: string;
}

export function loadConfig(): Config {
  const botToken = process.env.BOT_TOKEN || "";
  const guildId = process.env.GUILD_ID?.trim() || undefined;
  const environment = process.env.NODE_ENV || "development";

  if (!botToken) {
    console.warn("⚠️ Warning: BOT_TOKEN is not set in environment variables or .env file.");
  }

  return {
    botToken,
    guildId,
    environment,
  };
}

export const config: Config = loadConfig();

export const BOT_TOKEN: string = config.botToken;
export const GUILD_ID: string | undefined = config.guildId;

export default config;
