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

  if (commandName === 'add') {
    if (message.author.id !== client.config.devID) return message.reply('You don\'t have permission to add commands.');
    if (client.commands.get(args[0])) return message.reply('That command already exists.');

    client.commands.add(args.shift(), args.join(' '));
    message.channel.send(`Successfully added the command.`, { code: 'md' });
  }
  else {
    const command = client.commands.get(commandName);
    if (!command) message.channel.send('The command does not exist.');
    else command.run(message, args);
  }
  
};