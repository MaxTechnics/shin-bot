module.exports = {
	name: 'vibecheck',
	helpTitle: 'Vibecheck',
	category: 'Fun',
	usage: 'vibecheck',
	description: 'U vibin?',
	isHidden: false,
	aliases: ['vibing'],
	cooldown: 3,
	execute: async function(client, message, args) {
		const val = Math.round(Math.random() * 1);
		message.channel.send(`${message.member.displayName} ${val ? 'is' : 'is not'} vibing`);
	},
};
