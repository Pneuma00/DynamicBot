const Discord = require('discord.js');

module.exports = async (client, message) => {
  const embed = new Discord.MessageEmbed();
  const filter = msg => msg.author.id === message.author.id;

  const msg = await message.channel.send(embed.setTitle('명령어 추가 요청').setDescription('명령어 이름을 입력해주세요.'));
  collected = (await message.channel.awaitMessages(filter, { max: 1, time: 30000 })).first();
  const commandName = collected.content;
  if (client.commands.get(commandName)) return message.reply('이미 존재하는 명령어입니다.');
  if (client.requests.map(r => r.name).includes(commandName)) return message.reply('이미 동일한 이름의 명령어 추가 요청이 존재합니다.');
  
  collected.delete();
  msg.edit(embed.setDescription(`명령어 설명을 입력해주세요.\n\n**명령어 정보**\`\`\`js\n/**\n * Name: ${commandName}\n */\`\`\``));
  collected = (await message.channel.awaitMessages(filter, { max: 1, time: 60000 })).first();
  const commandDesc = collected.content;

  collected.delete();
  msg.edit(embed.setDescription(`명령어 코드를 입력해주세요.\n\n**명령어 정보**\`\`\`js\n/**\n * Name: ${commandName}\n * Desc:\n${commandDesc.split('\n').map(line => ' * ' + line).join('\n')}\n */\`\`\``));
  collected = (await message.channel.awaitMessages(filter, { max: 1, time: 300000 })).first();
  const code = collected.content.slice(5, -3);

  collected.delete();
  client.requests.add({ name: commandName, author: message.author.id, desc: commandDesc, code: code });
  msg.edit(embed.setTitle('명령어 추가 요청 완료!').setDescription(`\`${commandName}\` 명령어 추가를 성공적으로 요청했습니다.\n\n**명령어 정보**\`\`\`js\n/**\n * Name: ${commandName}\n * Desc:\n${commandDesc.split('\n').map(line => ' * ' + line).join('\n')}\n */\n${code}\`\`\``));
};