module.exports = async client => {
  console.log(`Ready to serve ${client.guilds.cache.size} Guilds, ${client.channels.cache.size} Channels, ${client.users.cache.size} Users.`);

  let index = 0;

  setInterval(() => {
    const activities_list = [`${client.guilds.cache.size} Servers`, `${client.users.cache.size} Users`];
    client.user.setActivity(`Prefix: ${client.config.prefix} | ${activities_list[index]}`);
    index = (index + 1) % activities_list.length;
  }, 5000);
};