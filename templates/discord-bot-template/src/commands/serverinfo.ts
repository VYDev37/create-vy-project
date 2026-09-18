import {
  ApplicationCommandType,
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  Guild,
  GuildPremiumTier,
} from "discord.js";
import { ICommand } from "@/interfaces/command";

const formatBoostTier = (tier: GuildPremiumTier): string => {
  switch (tier) {
    case GuildPremiumTier.Tier1:
      return "Tier 1";
    case GuildPremiumTier.Tier2:
      return "Tier 2";
    case GuildPremiumTier.Tier3:
      return "Tier 3";
    default:
      return "None";
  }
};

export const ServerInfoCommand: ICommand = {
  name: "serverinfo",
  description: "Display detailed statistics and information about this server.",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    const guild: Guild | null = interaction.guild;

    if (!guild) {
      await interaction.editReply({
        content: "❌ This command can only be used inside a Discord server.",
      });
      return;
    }

    // Fetch members and channels to ensure fresh cache
    await guild.members.fetch().catch(() => null);
    await guild.channels.fetch().catch(() => null);

    const totalMembers = guild.memberCount;
    const botCount = guild.members.cache.filter((m) => m.user.bot).size;
    const humanCount = totalMembers - botCount;

    const channels = guild.channels.cache;
    const textChannels = channels.filter((c) => c?.type === ChannelType.GuildText).size;
    const voiceChannels = channels.filter(
      (c) => c?.type === ChannelType.GuildVoice || c?.type === ChannelType.GuildStageVoice
    ).size;
    const categoryCount = channels.filter((c) => c?.type === ChannelType.GuildCategory).size;

    const roleCount = guild.roles.cache.size;
    const createdTimestamp = Math.floor(guild.createdTimestamp / 1000);

    const embed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle(`🏰 Server Information: ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 1024 }) || null)
      .addFields(
        {
          name: "👑 Owner",
          value: `<@${guild.ownerId}>`,
          inline: true,
        },
        {
          name: "🆔 Server ID",
          value: `\`${guild.id}\``,
          inline: true,
        },
        {
          name: "📅 Created On",
          value: `<t:${createdTimestamp}:F>\n(<t:${createdTimestamp}:R>)`,
          inline: true,
        },
        {
          name: "👥 Members",
          value: `• **Total:** ${totalMembers}\n• **Humans:** ${humanCount}\n• **Bots:** ${botCount}`,
          inline: true,
        },
        {
          name: "💬 Channels",
          value: `• **Text:** ${textChannels}\n• **Voice:** ${voiceChannels}\n• **Categories:** ${categoryCount}`,
          inline: true,
        },
        {
          name: "💎 Boost Status",
          value: `• **Tier:** ${formatBoostTier(guild.premiumTier)}\n• **Boosts:** ${guild.premiumSubscriptionCount ?? 0}`,
          inline: true,
        },
        {
          name: "🎭 Roles",
          value: `${roleCount} roles`,
          inline: true,
        },
        {
          name: "🛡️ Verification Level",
          value: `${guild.verificationLevel}`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    if (guild.bannerURL()) {
      embed.setImage(guild.bannerURL({ size: 1024 })!);
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
