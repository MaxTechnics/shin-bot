const fs = require('fs-extra');

module.exports = async (client, member) => {
	const { generalChannelID } = client.config;

	const { welcome } = await fs.readJsonSync('./deployData/settings.json', 'utf-8');

	if (!welcome.state) return;

	client.channels.cache.get(generalChannelID).send(`**${member.user.username}** ate shit and died`);
};
