const fs = require('fs-extra');
const { joinMessages } = require('../../assets/greeting/greetings.json');
const { handleLevels, tatsuLog } = require('../../utils/tatsuRole.js');

module.exports = async (client, member) => {
	const { generalChannelID } = client.config;

	const { welcome } = await fs.readJsonSync('./deployData/settings.json', 'utf-8');

	if (!member.roles.cache.has('832294367871107092')) await member.roles.add('832294367871107092'); // Hoob/member role

	tatsuLog(`Tatsu role checking for ${member.user.username} starts in 5 seconds`);
	setTimeout(() => {
		tatsuLog(`Running automatic (on member join) Tatsu role check for ${member.user.username} started`);
		handleLevels(client, member);
	}, 5000);

	if (!welcome.state) return;
	const randomWelc = joinMessages[Math.floor(Math.random() * joinMessages.length)];
	const formatWelc = randomWelc.replace('{user}', `<@${member.id}>`);

	client.channels.cache.get(generalChannelID).send(formatWelc);
};
