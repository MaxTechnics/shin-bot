const { Collection } = require('discord.js');
const fs = require('fs-extra');
const { simpleDuration } = require('../../utils/buildTimeString.js');

module.exports = async (client, message) => {
	const { prefix } = client.config;
	// Bots shall not trigger me
	if (message.author.bot) return;

	const { disabledCommands } = fs.readJSONSync('./deployData/settings.json', 'utf-8');

	// List up all commands
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Include aliases
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	// Is this command allowed inside DM?
	if (message.channel.type === 'DM') return message.channel.send('Nah mate, no DM\'s');

	// Does the message not start with the prefix or is this not a command?
	if (!message.content.toLowerCase().startsWith(prefix) || !command) return;

	// Cooldown?
	const cooldowns = client.cooldowns;
	if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = command.cooldown * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) return message.reply(`Hold on jeez, wait ${simpleDuration(expirationTime - now)} before reusing \`${command.name}\`?`);
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	// Is this command enabled?
	if (disabledCommands.includes(command.name)) return message.reply('Command disabled, blame max, sorry');

	// All requirements are met, try running the command
	try {
		command.execute(client, message, args);
	} catch (e) {
		throw new Error(e);
	}
};
