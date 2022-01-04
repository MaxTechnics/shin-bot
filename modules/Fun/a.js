const { shrimpID, maxID } = require('../../assets/global/memberIDs.json');

module.exports = {
	name: 'a',
	helpTitle: 'a',
	category: 'Fun',
	usage: 'a',
	description: 'Shrimp',
	isHidden: true,
	// aliases: [],
	cooldown: 0,
	execute: async function(client, message, args) {
		if (![shrimpID, maxID].includes(message.author.id)) return message.channel.send('lmao no, this command is only shrimp irony idot. good luck next time or not');

		if (message.deletable) message.delete();
		message.channel.send('a.');
	},
};
