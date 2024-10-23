import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import { DiscordConfig } from "./types";

let discordChannel: TextChannel | null = null;
let client: Client;

export const initializeDiscordBot = async (
  config: DiscordConfig
): Promise<void> => {
  client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  await client.login(config.botToken);

  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    discordChannel = client.channels.cache.get(config.channelId) as TextChannel;
  });
};

export const uploadFileToDiscord = async (
  filePath: string,
  fileName: string
): Promise<string> => {
  if (!discordChannel) {
    throw new Error("Discord channel is not available.");
  }

  const message = await discordChannel.send({
    files: [{ attachment: filePath, name: fileName }],
  });

  const fileUrl = message.attachments.first()?.url;

  if (!fileUrl) {
    throw new Error("File URL not found.");
  }

  return fileUrl;
};
