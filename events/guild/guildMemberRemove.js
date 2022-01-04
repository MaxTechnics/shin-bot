const fs = require('fs-extra');
const { leaveMessages } = require('../../assets/greeting/greetings.json');

module.exports = async (client, member) => {
	const { generalChannelID } = client.config;

	const { welcome } = await fs.readJsonSync('./deployData/settings.json', 'utf-8');

	if (!welcome.state) return;
	const randomBye = leaveMessages[Math.floor(Math.random() * leaveMessages.length)];
	const formatBye = randomBye.replace('{user}', `**${member.displayName}**`);
	client.channels.cache.get(generalChannelID).send(formatBye);

};
