const fs = require('fs-extra');

/**
 * Set the bot's status
 * @param {Client} client Discord client
 * @param {String} selectedStatus Status that has to be set
 */
const setSts = (client, selectedStatus) => {
	switch (selectedStatus) { // lmao, i fucking hate this.
		case 'online':
			return setRPC(client, 'online', 'your sins unfold', 'WATCHING');
		case 'walle':
		case 'wall-e':
			return setRPC(client, 'online', 'Wall-E', 'WATCHING');
		case 'next':
			const nextState = states[Math.floor(Math.random()*states.length)];
			return setSts(client, nextState);
		default:
			const snowy = [{activity: 'it snow ❄️', thing: 'WATCHING'}, {activity: 'with the snow ❄️', thing: 'PLAYING'}, {activity: 'jolly music', thing: 'LISTENING'}].randomElement();
			return setRPC(client, 'online', snowy.activity, snowy.thing);
			// return false;
	}
};

/**
 * Actually does the DJS API call to set the client status
 * @param {Client} client Discord client
 * @param {String} activityStatus Presence status (idle, dnd, online, invisible)
 * @param {String} activityName Custom status, what goes behind the 'playing, watching,...'
 * @param {String} activityType Type of activity (playing, watching, streaming,...)
 */
const setRPC = async (client, activityStatus, activityName, activityType) => {
	client.user.setPresence({
		status: activityStatus,
		activities: [{
			name: activityName,
			type: activityType
		}]
	});
	return true;
};

const states = ['online', 'wall-e']; // We don't want to have the bot appear offline
/**
 * Pick a random status and set it
 * @param {Client} client Discord client
 */
const randomStatus = async (client) => {
	// Fetch the settings JSON file and pull it's randomStatus string
	const settingsFile = await fs.readJsonSync('./deployData/settings.json', 'utf-8');
	if (settingsFile.randomStatus.state) setSts(client, states[Math.floor(Math.random()*states.length)]);
};

module.exports = {
	setSts,
	randomStatus
};
