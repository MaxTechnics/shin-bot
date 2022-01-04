// When I started writing this, only God and I understood what I was doing
// Now, only God knows
const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
const TatsuAPI = require('./utils/tatsuAPI.js');
const client = new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_BANS,
		// Intents.FLAGS.GUILD_EMOJIS,
		// Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		// Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_VOICE_STATES
	],
	partials: [
		'CHANNEL'
	]
});
const { randomStatus } = require('./utils/statusFunction.js');
const { birthdaySequelize } = require('./handlers/databases.js');

setInterval(function() { randomStatus(client) }, 60 * 30 * 1000); // change status every 30 min

client.config = ((process.argv.slice(2))[0] === 'release' ? require('./configRelease.json') : require('./configDebug.json'));
client.commands = new Collection();
client.cooldowns = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./modules/', { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
client.birthdays = require('./handlers/dbModels/birthdays.js')(birthdaySequelize);
client.interactions = new Collection();
client.event = {
	members: new Set(),
	pending: new Set(),
	started: false,
	guildID: client.config.eventServerGuildID,
	vcID: client.config.eventVcID,
	announceID: client.config.eventAnnounceChannelID,
	startTimestamp: null,
	endTimestamp: null
};
client.tatsuToken = client.config.tatsuApiKey;

// Log in
client.login(client.config.apiKey);

// if sh!t goes wrong
// if (client.config.devMode) client.on('debug', d => console.log(`${chalk.cyan('[Debug]')}:`, d)); // Debug stuff, only loads when running in debug mode
client.on('rateLimit', r => console.warn(chalk.yellow('[Ratelimit]'), r));
client.on('warn', w => console.warn(chalk.yellow('[Warn]'), w));
client.on('error', e => console.warn(chalk.redBright('[Error]'), e));
process.on('uncaughtException', e => console.warn(chalk.redBright('[Error]'), e.stack));
process.on('unhandledRejection', e => console.warn(chalk.redBright('[Error]'), e));
process.on('warning', e => console.warn(chalk.yellow('[Error]'), e.stack));

// Handlers' modules
['commands', 'event'].forEach(handler => {
	require(`./handlers/${handler}`)(client);
});
