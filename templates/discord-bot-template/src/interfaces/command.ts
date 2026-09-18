import {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  Client,
} from "discord.js";

export interface ICommand extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void> | void;
}
