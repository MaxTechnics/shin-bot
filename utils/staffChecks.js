const { Permissions } = require('discord.js');

/**
 * Check if the message author is staff
 * @param {Client} client Discord Client
 * @param {Message} message Message object
 * @param {Boolean} returnMessage whether a message needs to be returned
 * @returns {Boolean} Returns true if message.author can ban members
 */
const checkStaff = (client, message, returnMessage) => {
	if (!message.member.roles.cache.get(client.config.theHolyTrinityRoleID) || // Check by role
		!message.member.id == message.guild.ownerId || // Check if it's the owner
		!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ||
		!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS) ||
		!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS) ||
		!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
	) {
		if (returnMessage) message.channel.send('i pay the bills around here, yeah you slink away right there');
		return false;
	}
	return true;
};

module.exports = {
	checkStaff
};
