import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} from "discord.js";
import { ICommand } from "@/interfaces/command";
import { Commands } from "@/commands";

export const HelpCommand: ICommand = {
  name: "help",
  description: "Display the list of available commands and bot features.",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle("🤖 Bot Command Center")
      .setDescription(
        "Welcome! Here is a list of all registered slash commands available on this bot."
      )
      .setThumbnail(client.user?.displayAvatarURL() || null);

    Commands.forEach((cmd) => {
      embed.addFields({
        name: `\`/${cmd.name}\``,
        value: cmd.description || "No description provided.",
        inline: false,
      });
    });

    embed
      .addFields({
        name: "💡 Tips",
        value:
          "• All commands use Discord's native slash command system (`/`).\n• Type `/` in any text channel to view autocomplete options.",
        inline: false,
      })
      .setTimestamp()
      .setFooter({
        text: `${client.user?.username ?? "Discord Bot"} • Help Menu`,
        iconURL: client.user?.displayAvatarURL(),
      });

    await interaction.editReply({ embeds: [embed] });
  },
};
