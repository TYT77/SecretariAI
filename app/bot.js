const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (message.author.bot) return; // ボットによるメッセージは処理しない
  if (!message.content.startsWith(`@${client.user.username}`)) return; // ボット宛てのメンションであることを確認する

  // メンションされたユーザーが接続されているボイスチャンネルに入室する
  if (message.member.voice.channel) {
    const connection = await message.member.voice.channel.join();
    console.log(`Joined ${connection.channel.name}`);
  } else {
    message.reply('ボイスチャンネルに接続してから、もう一度試してください。');
  }
});

client.login(process.env.DISCORD_TOKEN);