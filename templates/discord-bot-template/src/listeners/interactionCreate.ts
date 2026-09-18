import {
  ChatInputCommandInteraction,
  Client,
  Events,
  Interaction,
  EmbedBuilder,
} from "discord.js";
import { Commands } from "@/commands";

export default (client: Client): void => {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      await handleSlashCommand(client, interaction);
    }
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName);

  if (!slashCommand) {
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "⚠️ Command not found or no longer available.",
        ephemeral: true,
      });
    }
    return;
  }

  try {
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply();
    }

    await slashCommand.run(client, interaction);
  } catch (error) {
    console.error(`❌ Error executing command /${interaction.commandName}:`, error);

    const errorEmbed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle("❌ Command Execution Error")
      .setDescription("An unexpected error occurred while executing this command.")
      .setTimestamp();

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ embeds: [errorEmbed] }).catch(() => null);
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true }).catch(() => null);
    }
  }
};
