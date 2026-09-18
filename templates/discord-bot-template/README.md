# Discord Bot TypeScript Template

Clean and modular Discord bot template built with **TypeScript** and **discord.js v14**, featuring native **Slash Commands** (`/`).

---

## Features

- **TypeScript & Discord.js v14**: Type-safe development with `ICommand` interfaces.
- **Modular Architecture**: Separate directories for `commands`, `listeners`, `interfaces`, and `config`.
- **Path Aliases**: Clean `@/*` imports mapped directly to `src/*`.
- **Built-in Slash Commands**:
  - `/ping`: Check bot latency, WebSocket heartbeat, and uptime with embeds.
  - `/help`: Interactive command overview using `EmbedBuilder`.
  - `/serverinfo`: Server details and stats (members, channels, roles, boosts, owner, icon).
- **Node.js & Bun Support**: Runs with `pnpm`, `npm`, `yarn`, or `bun`.
- **Error Handling & Auto-Defer**: Automatically defers interactions to prevent Discord 3-second timeouts.

---

## Project Structure

```plaintext
discord-bot-template/
├── src/
│   ├── commands/
│   │   ├── help.ts             # Slash command /help
│   │   ├── ping.ts             # Slash command /ping
│   │   ├── serverinfo.ts       # Slash command /serverinfo
│   │   └── index.ts            # Central command registry
│   ├── interfaces/
│   │   └── command.ts          # ICommand interface definition
│   ├── listeners/
│   │   ├── clientReady.ts      # clientReady event & slash command registration
│   │   ├── interactionCreate.ts # interactionCreate event handler
│   │   └── index.ts            # Central listener registry
│   ├── config.ts               # Central environment variable loader
│   └── index.ts                # Main entry point
├── .env.example                # Environment variable template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** v18+ or **Bun** v1.0+
- Discord Bot Application created on the [Discord Developer Portal](https://discord.com/developers/applications)

### 2. Discord Developer Portal Setup
1. Open the [Discord Developer Portal](https://discord.com/developers/applications).
2. Create a **New Application**.
3. Go to the **Bot** tab:
   - Copy the bot **Token**.
   - Enable **Privileged Gateway Intents** (specifically `Server Members Intent` for `/serverinfo`).
4. Go to **OAuth2** -> **URL Generator**:
   - **Scopes**: check `bot` and `applications.commands`.
   - **Bot Permissions**: check `Send Messages`, `Embed Links`, `Read Message History`, `View Channels`.
   - Copy the generated URL and open it in your browser to invite the bot to your server.

### 3. Environment Configuration
Copy `.env.example` to `.env`:

```bash
# PowerShell / Bash
cp .env.example .env
```

Fill in `.env`:
```env
BOT_TOKEN=your_bot_token_here
# Optional: Set Guild ID for instant slash command updates during local development
GUILD_ID=
```

### 4. Install Dependencies

Using **pnpm** (recommended):
```bash
pnpm install
```

Or using **npm** / **bun**:
```bash
npm install
# or
bun install
```

### 5. Running the Bot

#### Development Mode (Auto-Reload):
- **Node.js (tsx)**:
  ```bash
  pnpm dev
  # or: npm run dev
  ```
- **Bun**:
  ```bash
  bun run dev:bun
  ```

#### Production Mode:
- **Node.js**:
  ```bash
  npm run build
  npm start
  ```
- **Bun**:
  ```bash
  bun run start:bun
  ```

---

## Adding a New Slash Command

1. Create a new command file in `src/commands/<command-name>.ts`:

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
  description: "Description of the example command",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("Example Command")
      .setDescription("Hello from the new command!");

    await interaction.editReply({ embeds: [embed] });
  },
};
```

2. Register the command in `src/commands/index.ts`:

```typescript
import { ExampleCommand } from "@/commands/example";

export const Commands: ICommand[] = [
  PingCommand,
  HelpCommand,
  ServerInfoCommand,
  ExampleCommand,
];
```

The command will automatically sync to Discord when the bot starts.
