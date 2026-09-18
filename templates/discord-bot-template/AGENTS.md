# Agent Instructions & Guidelines

This project was scaffolded with `create-vy-project`.

## Active Stacks
- `discord-bot`

## Agent Workflow & Skill Guidelines
Before modifying, generating, or refactoring code in this repository, agents MUST consult the local skills located in `.agents/skills/`:

- **General & Anti-Slop:** Read `.agents/skills/general/stop-slop.md` for clean, human, humble writing without AI buzzwords or em-dashes.
- **Discord Bot Architecture & Conventions:** Read `.agents/skills/bot/discord-bot-convention.md` for discord.js v14 handlers, ICommand interfaces, slash command registration, and interaction handling.

---

## Core Directives & Standards

### 1. File & Event Naming Conventions (STRICT RULE)
- **Path Alias (`@/*`):** Use `@/*` mapped to `./src/*` for all internal project imports (e.g., `@/commands`, `@/listeners`, `@/interfaces/command`, `@/config`). NEVER use messy relative paths (`../../`).
- **Command Files (Exact Match with Slash Command Name):** File names in `src/commands/` **MUST** match the exact slash command name in `lowercase`/`kebab-case` (e.g., slash command `/ping` -> `ping.ts`, `/help` -> `help.ts`, `/serverinfo` -> `serverinfo.ts`, `/user-profile` -> `user-profile.ts`).
- **Listener / Event Files (Exact Match with Discord.js Event Name):** File names in `src/listeners/` **MUST** match the exact Discord.js event name in `camelCase` (e.g., event `clientReady` -> `clientReady.ts`, event `interactionCreate` -> `interactionCreate.ts`, event `guildMemberAdd` -> `guildMemberAdd.ts`, event `messageCreate` -> `messageCreate.ts`).
- **Interfaces:** Keep interface contracts in `src/interfaces/` with `[domain].ts` (e.g., `command.ts` defining `ICommand`).

### 2. Architecture & Layer Responsibilities
- **`src/commands/` (Slash Commands Layer):**
  - Every command must implement the `ICommand` interface (`ChatInputApplicationCommandData` + `run` handler).
  - Export the command object (e.g., `export const PingCommand: ICommand = { ... }`).
  - Always register new commands in the `Commands` array in `src/commands/index.ts`.
- **`src/listeners/` (Event Listeners Layer):**
  - Event listeners attach handlers to the `Client` instance.
  - Export a default function accepting `(client: Client): void`.
  - Wire listeners inside `src/index.ts`.
- **`src/config.ts` (Centralized Configuration & Single Source of Truth):**
  - **ALL** environment variables **MUST** be declared, loaded, typed, and exported exclusively via `src/config.ts` (interface `Config` and `loadConfig()`).
  - **NEVER** access `process.env` directly from command handlers, listeners, or other modules. Always import `config` or named config exports from `src/config.ts`.
- **`src/index.ts` (Entry Point):**
  - Initializes `Client` with necessary `GatewayIntentBits`.
  - Registers listeners and authenticates via `client.login(BOT_TOKEN)`.

### 3. Interaction Handling & Auto-Deferral
- **Prevent Discord 3-Second Timeout:** In `interactionCreate.ts`, interactions must be automatically deferred via `await interaction.deferReply()` if not already deferred/replied.
- **Always Edit Reply:** Inside `run()` handlers, use `await interaction.editReply(...)` to return embeds or responses.
- **Robust Error Handling:** Wrap command execution in `try / catch` blocks and respond with a user-friendly error `EmbedBuilder`.

### 4. Security & Environment
- **Central Config & No Direct `process.env`:** Always register new environment variables in `src/config.ts` and add dummy defaults to `.env.example`.
- **Never Hardcode Tokens:** Never hardcode Discord bot tokens or API secrets in source code.
- **Environment File:** Store secrets in `.env` and provide placeholders in `.env.example`.
