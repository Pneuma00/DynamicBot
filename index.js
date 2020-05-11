require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");
client.config = config;

const fs = require('fs');

client.commands = new Discord.Collection();

Reflect.defineProperty(client.commands, 'add', {
	value: async (commandName, commandDesc, code) => {
    await fs.writeFileSync(`./commands/custom/${commandName}.js`,
`module.exports = {
  name: '${commandName}',
  desc: '${commandDesc.replace(/\n/g, '\\n')}',
  run: async (message, args) => {
    ${code}
  }
}`);
    const command = require(`./commands/custom/${commandName}.js`);
		client.commands.set(command.name, command);
	},
});

fs.readdirSync('./commands/custom').filter(file => file.endsWith('.js')).forEach(file => {
  const command = require(`./commands/custom/${file}`);
  client.commands.set(command.name, command);
});

fs.readdirSync("./events/").forEach(file => {
  const event = require(`./events/${file}`);
  const eventName = file.split(".")[0];
  client.on(eventName, event.bind(null, client));
});

client.login();