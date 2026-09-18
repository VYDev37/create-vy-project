import { ICommand } from "@/interfaces/command";
import { PingCommand } from "@/commands/ping";
import { HelpCommand } from "@/commands/help";
import { ServerInfoCommand } from "@/commands/serverinfo";

export const Commands: ICommand[] = [
  PingCommand,
  HelpCommand,
  ServerInfoCommand,
];

export { PingCommand, HelpCommand, ServerInfoCommand };
