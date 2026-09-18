# Discord Bot Conventions

## Bot Stack
- **Language**: TypeScript (Node.js / Bun)
- **Library**: Discord.js v14
- **Architecture**: Modular Command & Listener Pattern with Native Slash Commands (`/`)

---

## File & Event Naming Conventions (STRICT RULE)

- **Slash Command Files (Exact Match with Command Name):**
  - File names inside `src/commands/` **MUST** match the exact slash command name in `lowercase`/`kebab-case`.
  - Examples:
    - Slash command `/ping` -> `ping.ts`
    - Slash command `/help` -> `help.ts`
    - Slash command `/serverinfo` -> `serverinfo.ts`
    - Slash command `/user-profile` -> `user-profile.ts`
  - Export the command with PascalCase naming convention (`PingCommand: ICommand`).

- **Event Listener Files (Exact Match with Discord.js Event Name):**
  - File names inside `src/listeners/` **MUST** match the exact Discord.js event name in `camelCase`.
  - Examples:
    - Event `clientReady` -> `clientReady.ts`
    - Event `interactionCreate` -> `interactionCreate.ts`
    - Event `guildMemberAdd` -> `guildMemberAdd.ts`
    - Event `messageCreate` -> `messageCreate.ts`
  - Export a default function: `export default (client: Client): void => { ... }`.

- **Interfaces & Config:**
  - `src/interfaces/command.ts`: `ICommand` extending `ChatInputApplicationCommandData` with `run` handler.
  - `src/config.ts`: Environment configuration.

- **Path Alias (`@/*`):**
  - Always use `@/*` mapped to `./src/*` for all internal imports (e.g. `@/commands`, `@/listeners`, `@/interfaces/command`, `@/config`). Avoid messy relative paths (`../../`).

---

## Architecture & Layer Responsibilities

```plaintext
src/
├── commands/
│   ├── ping.ts             # Slash command /ping
│   ├── help.ts             # Slash command /help
│   ├── serverinfo.ts       # Slash command /serverinfo
│   └── index.ts            # Central registry exporting Commands array
├── interfaces/
│   └── command.ts          # ICommand interface definition
├── listeners/
│   ├── clientReady.ts      # Ready event & guild/global command registration
│   ├── interactionCreate.ts # Interaction dispatch & auto-deferral
│   └── index.ts            # Central listener registration
├── config.ts               # Environment variable parsing
└── index.ts                # Client initialization & Discord gateway login
```

---

## Centralized Environment Configuration (`src/config.ts`)

Like the Go template's `LoadConfig()` pattern, all environment variables **MUST** be registered, loaded, and exported in a single central place: `src/config.ts`.

```typescript
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
```

**Rules for Environment Variables:**
- **Single Source of Truth:** Never call `process.env.*` directly inside commands, listeners, or utilities. Always import `config` or named constants from `src/config.ts`.
- **New Variables:** Whenever you add a new environment variable, define its type in `Config`, its parsing with default value in `loadConfig()`, and add a placeholder in `.env.example`.

---

## Interaction Handling & Deferral Rules

1. **Auto-Defer in `interactionCreate.ts`:**
   - Discord requires an initial acknowledgement within **3 seconds**, or the interaction times out.
   - Always call `await interaction.deferReply()` if `!interaction.deferred && !interaction.replied` before running the command logic.
2. **Always Use `editReply`:**
   - Inside command `run(client, interaction)` handlers, always use `await interaction.editReply({ ... })`.
3. **Graceful Error Handling:**
   - Always wrap execution in `try / catch` blocks.
   - On error, send a clean error embed back via `editReply` so the user knows what happened.

---

## Command Creation Template

```typescript
import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} from "discord.js";
import { ICommand } from "@/interfaces/command";

export const ExampleCommand: ICommand = {
  name: "example",
  description: "Example command description",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("Example Title")
      .setDescription("Hello from the example command!");

    await interaction.editReply({ embeds: [embed] });
  },
};
```

Remember to export and add every new command to `Commands` in `src/commands/index.ts`.
