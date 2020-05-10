require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");
client.config = config;

const fs = require('fs');

client.commands = new Discord.Collection();

Reflect.defineProperty(client.commands, 'add', {
	value: async (commandName, code) => {
    await fs.writeFileSync(`./commands/${commandName}.js`,
`module.exports = {
  name: '${commandName}',
  run: async (message, args) => {
    ${code.slice(5, -3)}
  }
}`);
    const command = require(`./commands/${commandName}.js`);
		client.commands.set(command.name, command);
	},
});

fs.readdirSync('./commands/').filter(file => file.endsWith('.js')).forEach(file => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
});

fs.readdirSync("./events/").forEach(file => {
  const event = require(`./events/${file}`);
  const eventName = file.split(".")[0];
  client.on(eventName, event.bind(null, client));
});

client.login();