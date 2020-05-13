const Discord = require('discord.js');

module.exports = async (client, message, dashboardMsg) => {
  const embed = new Discord.MessageEmbed();
  const filter = msg => msg.author.id === client.config.devID;

  embed.setTitle('명령어 요청 목록')
    .setDescription(
      (client.requests.slice(0, Math.min(client.requests.length, 10)).map(r => `${r.order}. \`${r.name}\` by ${client.users.cache.get(r.author).username}`).join('\n')) +
      (client.requests.length > 10 ? `\n... ${client.requests.length - 10} more requests` : '')
    );
  dashboardMsg.edit(embed);
  let collected = (await message.channel.awaitMessages(filter, { max: 1, time: 30000 })).first();
  const index = collected.content;
  if (index !== index.match(/[0-9]+/g)[0]) return message.reply('올바른 번호를 입력해주세요.');
  if (index < 1 || index > Math.min(client.requests.length, 10)) return message.reply('올바른 범위의 번호를 입력해주세요. (1~10)');
  const command = client.requests[index - 1];
  
  collected.delete();
  embed.setTitle('명령어 요청 정보')
    .setDescription(`**Name:** \`${command.name}\`\n**Author:** \`${client.users.cache.get(command.author).tag} (${command.author})\`\n\n**Description**\`\`\`${command.desc}\`\`\`\n**Code**\`\`\`js\n${command.code}\`\`\``);
  dashboardMsg.edit(embed);
};