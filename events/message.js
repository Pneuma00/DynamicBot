const Discord = require('discord.js');
const { simpleDate } = require('../funcs');

module.exports = async (client, message) => {
  if (message.system) return;
  if (message.author.bot) return;

  if (message.content.indexOf(client.config.prefix) !== 0) return;

  if (message.channel.type === 'text')
    console.log(`[${simpleDate(message.createdAt)}] [Guild] (Guild: ${message.guild.id}) (Channel: ${message.channel.id}) ${message.author.tag} : ${message.content}`);
  else console.log(`[${simpleDate(message.createdAt)}] [DM] (User: ${message.author.id}) ${message.author.tag} : ${message.content}`);

  const contents = message.content.slice(client.config.prefix.length).trim();
  const args = contents.split(/ +/g);
  const commandName = args.shift().toLowerCase();

  if (commandName === 'admin') {
    if (message.author.id !== client.config.devID) return message.reply('어드민 명령어를 사용할 권한이 없습니다.');
    require('../commands/admin.js')(client, message);
  }
  else {
    const command = client.commands.get(commandName);
    if (!command) return message.channel.send('존재하지 않는 명령어입니다.');

    try {
      command.run(message, args);
    } catch (err) {
      message.channel.send(`오류가 발생하였습니다: \`\`\`${err}\`\`\``);
    }
  }
};