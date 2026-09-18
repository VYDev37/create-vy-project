import { ActivityType, Client, Events } from "discord.js";
import { Commands } from "@/commands";
import { GUILD_ID } from "@/config";

export default (client: Client): void => {
  client.once(Events.ClientReady, async () => {
    if (!client.user || !client.application) {
      return;
    }

    try {
      if (GUILD_ID) {
        const targetGuild = client.guilds.cache.get(GUILD_ID);
        if (targetGuild) {
          await targetGuild.commands.set(Commands);
          console.log(`⚡ Slash commands registered to Guild: ${targetGuild.name} (${targetGuild.id})`);
        } else {
          console.warn(`⚠️ Guild ID ${GUILD_ID} was specified but bot is not in that guild.`);
          await client.application.commands.set(Commands);
          console.log(`🌐 Slash commands registered globally.`);
        }
      } else {
        await client.application.commands.set(Commands);
        console.log(`🌐 Slash commands registered globally.`);
      }
    } catch (error) {
      console.error("❌ Failed to register slash commands:", error);
    }

    client.user.setPresence({
      activities: [
        {
          name: "/help | Serving servers",
          type: ActivityType.Watching,
        },
      ],
      status: "online",
    });

    console.log(`✅ Logged in as ${client.user.tag}!`);
    console.log(`📊 Connected to ${client.guilds.cache.size} guild(s).`);
  });
};
