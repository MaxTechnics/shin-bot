const { MessageEmbed } = require('discord.js');
const { checkStaff } = require('../../utils/staffChecks.js');
const { Red } = require('../../assets/global/colors.json');

module.exports = {
	name: 'cembed',
	helpTitle: 'a',
	category: 'Fun',
	usage: 'cembed [channel] [json-embed]',
	description: 'Sends an embed using JSON format to the specified channel',
	isHidden: false,
	aliases: ['jsonembed'],
	cooldown: 0,
	execute: async function(client, message, args) {
		if (!checkStaff(client, message, true)) return;

		const channel = message.mentions.channels.first() ||
			message.guild.channels.cache.get(args[0]) ||
			message.guild.channels.cache.find(c => c.name == args[0]);

		if (!channel) return message.channel.send('The channel provided can\'t be found!');

		try {
			const jsonEmbed = JSON.parse(args.slice(1).join(' '));
			channel.send({ embeds: [jsonEmbed] });

			message.channel.send('Successfully sent embed!');
		} catch (e) {
			const errEmbed = new MessageEmbed()
				.setColor(Red)
				.setTitle('Error')
				.setDescription(e.toString())
				.setFooter(client.user.username, client.user.displayAvatarURL({ format: 'png', size: 4096, dynamic: true }));

			message.channel.send({ embeds: [errEmbed] });
		}
	},
};
