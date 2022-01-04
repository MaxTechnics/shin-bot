const { MessageEmbed } = require('discord.js');
const { handleLevels, handleAllMembers } = require('../../utils/tatsuRole.js');
const { softGreen } = require('../../assets/global/colors.json');
const { checkStaff } = require('../../utils/staffChecks.js');

module.exports = {
	name: 'levelrole',
	helpTitle: 'Level Role Utility',
	category: 'Tools',
	usage: 'a',
	description: 'Shrimp',
	isHidden: false,
	// aliases: [],
	cooldown: 0,
	execute: async function(client, message, args) {
		if (!checkStaff(client, message, true)) return;
		switch (args[0]) {
			case 'me':
				await handleLevels(client, message.member);
				message.channel.send(`Tatsu check for \`${message.member.user.username}\` complete!`);
				break;
			case 'user':
				const user = /^\d{18}$/.test(args[1]) ? message.guild.members.cache.get(args[1]) : message.mentions.members.first();
				if (!user) return message.channel.send('No member specified');
				await handleLevels(client, user);
				message.channel.send(`Tatsu check for \`${user.user.username}\` complete!`);
				break;
			case 'all':
				handleAllMembers(client, message.channel);
				break;
			default:
				const embed = new MessageEmbed()
					.setTitle('What to do???????')
					.addFields(
						{ name: `\`${this.name} user {user ID or ping}\``, value: 'Run the role thing for a specific user' },
						{ name: `\`${this.name} me\``, value: 'Run the role thing on yourself' },
						{ name: `\`${this.name} all\``, value: 'Run the role thing for every members (please don\'t overuse this)' }
					)
					.setColor(softGreen)
					.setFooter('OH MY PKCELLL');
				message.channel.send({ embeds: [embed] });
				break;
		}
	},
};
