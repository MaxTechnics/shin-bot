const { softRed, softBlue, Orange } = require('../../assets/global/colors.json');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { readJSONSync, writeJSONSync } = require('fs-extra');
const { checkStaff } = require('../../utils/staffChecks.js');
const { updateSetting } = require('../../utils/settingsManager.js');


module.exports = {
	name: 'settings',
	helpTitle: 'Settings',
	category: 'Bot Management',
	usage: 'settings {[{enable, disable}] [command], [{welcomer, announce, welcome, greeting}] [{enable, disable}]}',
	description: 'Change bot settings.',
	isHidden: false,
	aliases: ['set', 'config'],
	cooldown: 5,
	execute: async function(client, message, args) {
		if (!checkStaff(client, message)) return;

		const readData = readJSONSync('./deployData/settings.json', 'utf-8');
		const input = args[1];

		switch (args[0]) {
			// Adjusting settings for the welcome command.
			case 'welcomer':
			case 'announce':
			case 'welcome':
			case 'greeting': {
				updateSetting(client, message, 'welcome', args[1]);
				break;
			}

			// Random status
			case 'randomstatus':
			case 'rstatus':
			case 'rstat':
			case 'rsts':
			case 'status': {
				updateSetting(client, message, 'randomStatus', args[1]);
				break;
			}

			// Setting the commands
			case 'enable': {
				if (input === 'all') {
					readData.disabledCommands.splice(0, readData.disabledCommands.length);
					await message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(softBlue)
								.setDescription('Enabled all previously disabled commands')
								.setTimestamp()
								.setFooter('Made with love')
						]
					});
					writeJSONSync('./deployData/settings.json', readData, { spaces: 4 });
					return;
				}

				if (!client.commands.get(input)) return message.channel.send('There\'s no such command! Make sure you are not using an alias.');
				if (!readData.disabledCommands.includes(input)) return message.channel.send(`The command \`${input}\` is not disabled!`);

				const embed = new MessageEmbed()
					.setColor(softBlue)
					.setDescription(`Enabled the command \`${input}\``)
					.setTimestamp()
					.setFooter('Made with love');

				readData.disabledCommands.splice(readData.disabledCommands.indexOf(input), 1); // Set
				await message.channel.send({ embeds: [embed] });
				writeJSONSync('./deployData/settings.json', readData, { spaces: 4 });
				break;
			}

			case 'disable': {
				if (!client.commands.get(input)) return message.channel.send('There\'s no such command! Make sure you are not using an alias.');
				if (readData.disabledCommands.includes(input)) return message.channel.send(`The command \`${input}\` is already disabled!`);
				if (input === 'settings') return message.channel.send('HAHAHAHAHAHAHAHAHAHAHHAHAHHAHAHAHHA very funni');

				const embed = new MessageEmbed()
					.setColor(softRed)
					.setDescription(`Disabled the command \`${input}\``)
					.setTimestamp()
					.setFooter('Made with love');

				readData.disabledCommands.push(input); // Set
				await message.channel.send({ embeds: [embed] });
				writeJSONSync('./deployData/settings.json', readData, { spaces: 4 });
				break;
			}

			case 'reset': {
				const defaults = readJSONSync('./assets/Configuration/defaults.json', 'utf-8');

				if (JSON.stringify(readData) === JSON.stringify(defaults)) return message.channel.send('The bot is already in its default settings!');

				const embed = new MessageEmbed()
					.setColor(Orange)
					.setDescription('Reset to defaults')
					.setTimestamp()
					.setFooter('Made with love');

				await message.channel.send({ embeds: [embed] });
				writeJSONSync('./deployData/settings.json', defaults, { spaces: 4 });
				break;
			}
			case 'list':
			default: {
				const formatBool = (elem) => elem ? 'Enabled' : 'Disabled';

				const embed = new MessageEmbed()
					.setColor(softBlue)
					.setDescription(
						stripIndents`Welcome Messages: \`${formatBool(readData.welcome.state)}\`
					Random status: \`${formatBool(readData.randomStatus.state)}\`
					Disabled commands: \`${readData.disabledCommands.length ? readData.disabledCommands.join(', ') : 'None'}\``);

				message.channel.send({ embeds: [embed] });
			}
		}
	},
};
