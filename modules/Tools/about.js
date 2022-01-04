const { softGreen } = require('../../assets/global/colors.json');
const { maxID } = require('../../assets/global/memberIDs.json');
const { version } = require('../../package.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'about',
	helpTitle: 'About',
	category: 'Tools',
	usage: 'about',
	description: 'Display the bot\'s information',
	isHidden: false,
	aliases: ['bot', 'botinfo', 'info'],
	cooldown: 20,
	execute: async function(client, message, args) {
		const { heapUsed, heapTotal } = process.memoryUsage();

		// Uptime calculations
		let seconds = Math.floor(process.uptime());
		let minutes = Math.floor(seconds / 60);
		let hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		seconds %= 60;
		minutes %= 60;
		hours %= 24;

		const aboutEmbed = new MessageEmbed()
			.setColor(softGreen)
			.setAuthor('About Shin Bot', client.user.displayAvatarURL({ format: 'png', size: 4096, dynamic: true }))
			.addFields(
				{ name: 'Bot version:', value: version, inline: true },
				{ name: 'Uptime:', value: `${days}d ${hours}h ${minutes}m ${seconds}s`, inline: true },
				{ name: 'Memory Usage:', value: `${(heapUsed / 1024 / 1024).toFixed(1)} MB / ${(heapTotal / 1024 / 1024).toFixed(1)}MB (${(heapUsed / heapTotal * 100).toFixed(2)}%)` },
				{ name: 'Dev:', value: `<@${maxID}>` }
			)
			.setFooter('Made with ☕, that\'s right mel, it\'s coffee!');

		message.channel.send({ embeds: [aboutEmbed] });
	},
};
