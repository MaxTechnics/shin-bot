const { Orange } = require('../../assets/global/colors.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	helpTitle: 'Help',
	category: 'Tools',
	usage: 'help (command)',
	description: 'Stop, get help',
	isHidden: false,
	aliases: ['commands'],
	cooldown: 0,
	execute: async (client, message, args) => {
		if (args[0]) {
			return getCmd(client, message, args[0]);
		} else {
			return getAll(client, message);
		}
	}
};

function getAll(client, message) {
	const embed = new MessageEmbed()
		.setColor(Orange)
		.setFooter('Syntax: () = optional, [] = required, {a, b} = choose between a or b');

	client.categories.forEach(category => {
		const commands = client.commands.filter(cmd => cmd.category == category && !cmd.isHidden); // Hide the hidden commands
		embed.addField(category, commands
			.map(str => `\`${str.name}\``) // Formats the names to include monospace
			.join(' ')); // Joints them by spaces instead of newlines
	});

	// After they're all added, send it
	return message.channel.send({ embeds: [embed] });
}

function getCmd(client, message, input) {
	const { prefix } = client.config;

	const embed = new MessageEmbed()
		.setColor(Orange)
		.setFooter('Syntax: () = optional; [] = required; {a, b} = choose between a or b');

	// Fetching the command data through client.commands or client.aliases
	const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

	// If the command isn't found (likely doesn't exist)
	if (!cmd) return message.channel.send(`**${input.toLowerCase()}** is not a command. Are you being delusional?`);

	// Adds its name based on helpName || uppercase name
	if (cmd.name) embed.setTitle(`**${cmd.helpName ? cmd.helpName : cmd.name[0].toUpperCase() + cmd.name.slice(1)} Command**`);
	// Adds aliases by mapping them
	if (cmd.aliases) embed.addField('**Aliases**', `${cmd.aliases.map(a => `\`${a}\``).join(' ')}`);
	// The description
	if (cmd.description) embed.addField('**Description**', `${cmd.description}`);
	// The usage
	if (cmd.usage) embed.addField('**Usage**', `\`${prefix}${cmd.usage}\``);

	return message.channel.send({ embeds: [embed] });
}
