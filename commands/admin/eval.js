const Discord = require('discord.js');

const clean = text => {
  if (typeof (text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}

module.exports = async (client, message, dashboardMsg) => {
  const embed = new Discord.MessageEmbed();
  const filter = msg => msg.author.id === client.config.devID;

  dashboardMsg.edit(embed.setTitle('코드 실행').setDescription('코드를 입력해주세요.'));
  let collected = (await message.channel.awaitMessages(filter, { max: 1, time: 30000 })).first();
  const code = collected.content.slice(6, -4);
  collected.delete();
    
  try {
    let evaled = eval(code);
 
    if (typeof evaled !== "string")
      evaled = require("util").inspect(evaled);
 
    embed.setColor('GREEN')
      .setTitle('코드 실행 결과')
      .setDescription(`:inbox_tray: **입력 함수 코드:**\n\`\`\`js\n${code}\`\`\`\n:outbox_tray: **실행 결과:**\n\`\`\`xl\n${clean(evaled)}\`\`\``)
      .setTimestamp();
    dashboardMsg.edit(embed);
  }
  catch (err) {
    embed.setColor('RED')
      .setTitle('코드 실행 오류')
      .setDescription(`:inbox_tray: **입력 함수 코드:**\n\`\`\`js\n${code}\`\`\`\n:outbox_tray: **오류 메시지:**\n\`\`\`xl\n${clean(err)}\`\`\``)
      .setTimestamp();
    dashboardMsg.edit(embed);
  }
};