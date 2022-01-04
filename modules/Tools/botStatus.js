const { setSts } = require('../../utils/statusFunction.js');
const { checkStaff } = require('../../utils/staffChecks.js');

module.exports = {
	name: 'status',
	helpTitle: 'Status',
	category: 'Tools',
	usage: 'status [{online, walle, next}]',
	description: 'Set the client\'s status',
	isHidden: false,
	aliases: ['sts', 'stat'],
	cooldown: 1,
	execute: async function(client, message, args) {
		if (!checkStaff(client, message, true)) return;

		switch (args[0]) {
			case 'online':
			case 'walle':
			case 'wall-e':
			case 'next':
				if (!setSts(client, args[0])) return message.channel.send('Something went wrong');
				await message.react('✅');
				break;
			default:
				return message.channel.send('Invalid argument given');
		}
	},
};
