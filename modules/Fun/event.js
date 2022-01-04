const { MessageEmbed } = require('discord.js');
const { checkStaff } = require('../../utils/staffChecks.js');
const { Red } = require('../../assets/global/colors.json');

/**
 * KNOWN ISSSUES REGARDING THE EVENT MODULE
 * - When a member is eliminated, then rejoins the VC, then leaves, the grace period + elimination message still gets shown
 * even though they are no longer in the count list
 * - The leave part doesn't get triggered if you switch to another VC before disconnecting (cheat mode BTW)
 * - The event count shows 'there are currently 0 members' if the event is not started, a check should be implemented to see whether event is started
 */

module.exports = {
	name: 'event',
	helpTitle: 'Start/End November 13th Event',
	category: 'Fun',
	usage: 'event',
	description: 'Event stuff',
	isHidden: true,
	// aliases: [],
	cooldown: 0,
	execute: async function(client, message, args) {
		switch (args[0]) {
			case 'start': {
				// SELF-REMINDER: Change this to the Event VC ID Later
				const voiceChannel = message.guild.channels.cache.get(client.event.vcID);
				// if (!message.member.roles.cache.find(r => r.name === 'Staff')) return; // only listen to Staff role
				if (!checkStaff(client, message, true)) return;

				try {
					const time = 10 * 60 * 1000;
					const msg = await message.guild.channels.cache.get(client.event.announceID).send(`Event will start <t:${Math.floor((Date.now() + time) / 1000)}:R>`);
					// Where the fun begins
					setTimeout(() => {
						voiceChannel.members.map(m => m.id).forEach(elem => {
							client.event.members.add(elem);
						});
						client.event.started = true;
						client.event.startTimestamp = Date.now();
						msg.edit('The VC Challenge has started. The one who stays for the most time will win. Good luck everyone!');
					}, time);
				} catch (e) {
					const errEmbed = new MessageEmbed()
						.setColor(Red)
						.setTitle('Something\'s wrong...')
						.addField('Error', `\`${e.message}\``);
					message.channel.send(errEmbed);
					console.log(e);
				}
				break;
			}
			case 'members':
			case 'count': {
				const members = [...client.event.members]
					.map(m => message.guild.members.cache.get(m).user.username)
					.join('\n');
				message.channel.send(`There are currently \`${client.event.members.size}\` members: \`\`\`\n${members}\n\`\`\``);
				break;
			}
			default: {
				message.channel.send('Invalid argument.');
				break;
			}
		}
	},
};
