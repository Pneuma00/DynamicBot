const Discord = require('discord.js');

module.exports = async (client, message) => {
  const filter = msg => msg.author.id === client.config.devID;

  const embed = new Discord.MessageEmbed();

  const msg = await message.channel.send(embed.setTitle('어드민 대시보드').setDescription('옵션을 입력해주세요.'));
  let collected = (await message.channel.awaitMessages(filter, { max: 1, time: 30000 })).first();
  collected.delete();

  if (collected.content === 'add') {
    require('./admin/add.js')(client, message, msg);
  }
  else if (collected.content === 'eval') {
    require('./admin/eval.js')(client, message, msg);
  }
  else {
    return message.channel.send('존재하지 않는 옵션입니다.')
  }
};