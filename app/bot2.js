const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// bot tokenの読み込み
const token = process.env.DISCORD_TOKEN;

// 初期化処理
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('voiceStateUpdate', async(oldState, newState) => {
	
	const channel = oldState.member.guild.channels.cache.find(ch => ch.name === config.sendCh);
	
	if (oldState.channelId === null && newState.channelId !== null) {
		if (oldState.member.nickname !== null) {
			return channel.send(`${oldState.member.nickname}さんが入室しました。`);
		} else {
			return channel.send(`${oldState.member.user.tag.slice(0, -5)}さんが入室しました。`);
		}
	} else if (oldState.channelId !== null && newState.channelId === null) {
		if (newState.member.nickname !== null) {
			return channel.send(`${newState.member.nickname}さんが退出しました。`);
		} else {
			return channel.send(`${newState.member.user.tag.slice(0, -5)}さんが退出しました。`);
		}
  	}
});

//返答
client.on('messageCreate', message => {
    
	console.log(message.content)
	
	if (message.author.bot) return;

    message.channel.send('hi!');
    
});

client.login(token);
