// clone-channels.js - Sadece kanalları klonla
require('dotenv').config();
const { Client, ChannelType } = require('discord.js');
const Selfbot = require('discord.js-selfbot-v13');

const ACCOUNT_TOKEN = process.env.ACCOUNT_TOKEN;
const BOT_TOKEN = process.env.BOT_TOKEN;
const SOURCE_GUILD_ID = process.env.SOURCE_GUILD_ID;
const TARGET_GUILD_ID = process.env.TARGET_GUILD_ID;

if (!ACCOUNT_TOKEN || !BOT_TOKEN || !SOURCE_GUILD_ID || !TARGET_GUILD_ID) {
  console.error('❌ Missing environment variables in .env file');
  process.exit(1);
}

const selfClient = new Selfbot.Client({
  checkUpdate: false,
  intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_EMOJIS_AND_STICKERS'],
});

const botClient = new Client({
  intents: 1 | 2 | 8,
});

const delay = ms => new Promise(res => setTimeout(res, ms));

// Channel type mapping
const CHANNEL_TYPES = {
  'GUILD_TEXT': 0,
  'DM': 1,
  'GUILD_VOICE': 2,
  'GROUP_DM': 3,
  'GUILD_CATEGORY': 4,
  'GUILD_NEWS': 5,
  'GUILD_STORE': 6,
  'GUILD_NEWS_THREAD': 10,
  'GUILD_PUBLIC_THREAD': 11,
  'GUILD_PRIVATE_THREAD': 12,
  'GUILD_STAGE_VOICE': 13,
  'GUILD_FORUM': 15,
};

async function cloneChannels() {
  try {
    const sourceGuild = await selfClient.guilds.fetch(SOURCE_GUILD_ID);
    console.log(`🔎 Fetched source guild: ${sourceGuild.name}`);

    const targetGuild = await botClient.guilds.fetch(TARGET_GUILD_ID);
    console.log(`🎯 Target guild: ${targetGuild.name}`);

    // Delete existing channels
    console.log('🗑️ Deleting existing channels...');
    const existingChannels = targetGuild.channels.cache.filter(c => c.type !== 'GUILD_CATEGORY');
    
    for (const [, channel] of existingChannels) {
      try {
        await channel.delete('Cleanup before cloning');
        console.log(`✅ Deleted channel: ${channel.name}`);
        await delay(200);
      } catch (e) {
        console.warn(`⚠️ Failed to delete channel ${channel.name}: ${e.message}`);
      }
    }

    // Delete existing categories
    console.log('🗑️ Deleting existing categories...');
    const existingCategories = targetGuild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY');
    
    for (const [, category] of existingCategories) {
      try {
        await category.delete('Cleanup before cloning');
        console.log(`✅ Deleted category: ${category.name}`);
        await delay(200);
      } catch (e) {
        console.warn(`⚠️ Failed to delete category ${category.name}: ${e.message}`);
      }
    }

    // Clone Categories
    console.log('🗂️ Cloning categories...');
    const categoryMap = new Map();
    const sourceCategories = sourceGuild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY');
    
    for (const [, category] of sourceCategories) {
      try {
        const newCat = await targetGuild.channels.create({
          name: category.name,
          type: ChannelType.GuildCategory,
          reason: 'Cloned category',
        });
        categoryMap.set(category.id, newCat);
        console.log(`✅ Category created: ${category.name}`);
        await delay(300);
      } catch (e) {
        console.warn(`⚠️ Failed to create category ${category.name}: ${e.message}`);
      }
    }

    // Clone Channels
    console.log('📺 Cloning channels...');
    const sourceChannels = sourceGuild.channels.cache.filter(c => c.type !== 'GUILD_CATEGORY');
    
    for (const [, channel] of sourceChannels) {
      try {
        const parent = channel.parentId ? categoryMap.get(channel.parentId) : null;
        
        // Determine channel type
        let channelType = ChannelType.GuildText; // default
        if (channel.type === 'GUILD_VOICE') {
          channelType = ChannelType.GuildVoice;
        } else if (channel.type === 'GUILD_NEWS') {
          channelType = ChannelType.GuildNews;
        } else if (channel.type === 'GUILD_STAGE_VOICE') {
          channelType = ChannelType.GuildStageVoice;
        } else if (channel.type === 'GUILD_FORUM') {
          channelType = ChannelType.GuildForum;
        }

        await targetGuild.channels.create({
          name: channel.name,
          type: channelType,
          topic: channel.topic || null,
          nsfw: channel.nsfw || false,
          bitrate: channel.bitrate || null,
          userLimit: channel.userLimit || null,
          parent: parent || null,
          reason: 'Cloned channel',
        });
        console.log(`✅ Channel created: ${channel.name}`);
        await delay(300);
      } catch (e) {
        console.warn(`⚠️ Failed to create channel ${channel.name}: ${e.message}`);
      }
    }

    console.log('\n✅ Channel cloning completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

let selfbotReady = false;
let botReady = false;

selfClient.on('ready', () => {
  selfbotReady = true;
  console.log('🔐 Selfbot logged in');
  checkBothReady();
});

botClient.on('ready', () => {
  botReady = true;
  console.log('🤖 Bot logged in');
  checkBothReady();
});

function checkBothReady() {
  if (selfbotReady && botReady) {
    cloneChannels();
  }
}

botClient.on('error', err => {
  console.error('❌ Bot error:', err.message);
  process.exit(1);
});

selfClient.on('error', err => {
  console.error('❌ Selfbot error:', err.message);
  process.exit(1);
});

console.log('[DEBUG] Starting logins...');
selfClient.login(ACCOUNT_TOKEN);
botClient.login(BOT_TOKEN);

// Timeout after 60 seconds
setTimeout(() => {
  if (!selfbotReady || !botReady) {
    console.error('⏱️ Login timeout');
    process.exit(1);
  }
}, 60000);
