import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} from "discord.js";
import { ICommand } from "@/interfaces/command";

export const PingCommand: ICommand = {
  name: "ping",
  description: "Check bot latency and Discord API heartbeat.",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    const startTime = Date.now();
    const wsPing = client.ws.ping;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("🏓 Pong!")
      .setDescription("Bot connectivity and latency statistics.")
      .addFields(
        {
          name: "📡 Bot Latency",
          value: `\`${Date.now() - startTime}ms\``,
          inline: true,
        },
        {
          name: "💓 WebSocket Ping",
          value: `\`${wsPing >= 0 ? `${wsPing}ms` : "Calculating..."}\``,
          inline: true,
        },
        {
          name: "⏱️ Uptime",
          value: `<t:${Math.floor((Date.now() - (client.uptime ?? 0)) / 1000)}:R>`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.editReply({ embeds: [embed] });
  },
};
