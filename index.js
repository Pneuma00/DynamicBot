require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");
client.config = config;

const fs = require('fs');
const JSON = require('JSON');

// =============================================================================================================================

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

client.requests = [];

Reflect.defineProperty(client.requests, 'add', {
	value: async (_command) => {
    const command = {
      ..._command,
      ...{ order: client.requests.length + 1 }
    };
    await fs.writeFileSync(`./commands/request/${command.name}.json`, JSON.stringify(command));
    client.requests.push(command);
	},
});

// =============================================================================================================================

fs.readdirSync('./commands/custom').filter(file => file.endsWith('.js')).forEach(file => {
  const command = require(`./commands/custom/${file}`);
  client.commands.set(command.name, command);
});

fs.readdirSync('./commands/request').filter(file => file.endsWith('.json')).forEach(file => {
  const command = require(`./commands/request/${file}`);
  client.requests.push(command);
});
client.requests.sort((a, b) => a.order - b.order);

fs.readdirSync("./events/").forEach(file => {
  const event = require(`./events/${file}`);
  const eventName = file.split(".")[0];
  client.on(eventName, event.bind(null, client));
});

client.login();