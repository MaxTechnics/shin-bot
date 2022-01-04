const ms = require('ms');
const { White } = require('../../assets/global/colors.json');

module.exports = async (client, oldState, newState) => {
	if (!oldState.channelId && newState.channel.id === client.config.kingVcID) {
		return client.channels.cache.get(client.config.kingVcChannelID).send(`Welcome to the shin crack shack, ${newState.member.displayName}.`);
	}

	/* LOGS (testing purposes only) (put where they should be) */
	// console.log(client.event.members);
	// console.log(oldState.id);
	// console.log(newState.channel === null && client.event.started);
	// console.log((oldState.channelID || newState.channelID) != client.event.vcID);
	/* console.log(stripIndents
	`${client.event.startTimestamp}: ${typeof client.event.startTimestamp}
	${client.event.endTimestamp}: ${typeof client.event.endTimestamp}`); */
	// console.log(`Is the Set of size 1? ${client.event.members.size === 1}`);

	// Make it not listen to other VCs
	// SELF-REMINDER: change VC ID
	if ((oldState.channelId || newState.channelId) != client.event.vcID) return;
	if (!oldState.channel && client.event.started && client.event.pending.has(oldState.id)) {
		client.event.pending.delete(oldState.id);
	}

	if (!newState.channel && client.event.started) {
		client.event.pending.add(oldState.id);
		client.channels.cache.get(client.event.announceID).send(`<@!${oldState.id}> has left, but they have a grace period of 2 minutes before being eliminated`);
		setTimeout(() => {
			if (client.event.pending.has(oldState.id)) {
				client.event.members.delete(oldState.id);
				client.channels.cache.get(client.event.announceID).send(`**${oldState.member.user.username}** has been eliminated!`);

				if (client.event.members.size == 1) {
					const winnerID = [...client.event.members][0];
					client.event.started = false;
					client.event.endTimestamp = Date.now();

					// Send winner message (mention will work whether there's a nick or not)
					// SELF-REMINDER: change ID to some announcments channel
					client.channels.cache.get(client.event.announceID).send({
						content: `The winner is <@!${winnerID}>. Congrats, you have won the VC event!`,
						embeds: [{
							color: `0x${White}`,
							fields: [
								{
									name: 'Start Time',
									value: `${formatDate(client.event.startTimestamp)}`,
									inline: false
								},
								{
									name: 'End Time',
									value: `${formatDate(client.event.startTimestamp)}`,
									inline: false
								},
								{
									name: 'Time Taken',
									value: ms(client.event.endTimestamp - client.event.startTimestamp, { long: true }),
									inline: false
								}
							]
						}]
					});
				}
			}
		}, 2 * 60 * 1000);
	}
};

/**
 * Formats the date given
 * @param {Date} date A Date object to format
 */
const formatDate = (date) => `<t:${Math.floor(date / 1000)}>`;
