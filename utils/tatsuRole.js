const chalk = require('chalk');
const TatsuAPI = require('./tatsuAPI.js');
const { MessageEmbed } = require('discord.js');
const { Orange, softGreen } = require('../assets/global/colors.json');
const { createBar } = require('./createBar.js');

const shinLevels = {
	level5: {
		requiredScore: 500,
		roleID: '856306800857317406'
	},
	level4: {
		requiredScore: 4000,
		roleID: '856307057073979413'
	},
	level3: {
		requiredScore: 30000,
		roleID: '856307225302401045'
	},
	level2: {
		requiredScore: 200000,
		roleID: '856307337479716864'
	},
	level1: {
		requiredScore: 1000000,
		roleID: '856306313708961814'
	}
};

const tatsuLog = (...log) => {
	console.log(chalk.cyanBright('[TATSU SYSTEM]:'), ...log);
};

const getMemberLevel = (score) => {
	if (score < shinLevels.level5.requiredScore) return null;
	if (score < shinLevels.level4.requiredScore) return shinLevels.level5.roleID;
	if (score < shinLevels.level3.requiredScore) return shinLevels.level4.roleID;
	if (score < shinLevels.level2.requiredScore) return shinLevels.level3.roleID;
	if (score < shinLevels.level1.requiredScore) return shinLevels.level2.roleID;
	if (score > shinLevels.level4.requiredScore) return shinLevels.level1.roleID;
};

// const d = async () => new Promise(r => setTimeout(r, 5000));
// const d = async () => new Promise(r => setTimeout(r, 50));
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const handleAllMembers = async (client, channel) => {
	const allEmbed = new MessageEmbed()
		.setTitle('Running Tatsu level role system')
		.setDescription('This causes a lot of API calls so please don\'t overuse it\nAlso it\'ll take a solid while, sorry')
		.setColor(Orange)
		.setFooter('I blame frank');

	const server = client.guilds.cache.get(client.config.shinServerID);
	const ok = await server.members.fetch();
	const members = ok.map(m => m);
	allEmbed.setFields({
		name: 'Progress: 0%',
		value: `<a:dancinphroag:855256509114351636>▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\nAbout ${Math.floor(2.5 * members.length)}s remaining.`
	});
	const msg = await channel.send({ embeds: [allEmbed] });
	let count = 0;
	for await (const member of members) {
		count++;
		await sleep(2000);
		await handleLevels(client, member);
		if (count % 3 == 0) {
			allEmbed.setFields({
				name: `Progress: ${Math.floor((count / members.length) * 100)}%`,
				value: `${createBar(members.length, count)}\nAbout ${Math.floor(2.5 * (members.length - count))}s remaining.`
			});
			await msg.edit({ embeds: [allEmbed] });
		}
	}
	tatsuLog('Runner for everyone finished!');
	allEmbed.setFields({ name: 'Progress: 100%', value: `${createBar(1, 1)}` });
	allEmbed.setTitle('Tatsu role system finished!');
	allEmbed.setColor(softGreen);
	allEmbed.setFooter('Oh what a desolate drive, but we made it.');
	msg.edit({ embeds: [allEmbed] });
	return true;
};

const handleLevels = async (client, member) => {
	const tatsu = new TatsuAPI(client.tatsuToken);
	const rank = await tatsu.getUserRankInGuild(member.id, client.config.shinServerID);
	// console.log(rank);
	tatsuLog(`${member.user.username}'s score: ${rank.score}`);
	const roleID = getMemberLevel(rank.score);
	await handleRoles(client, member, roleID);
	return true;
};

const addRole = async (member, role) => {
	tatsuLog(`Adding ${role.name} to ${member.user.username}`);
	await member.roles.add(role);
	return true;
};

const removeRole = async (member, role) => {
	tatsuLog(`Removing ${role.name} from ${member.user.username}`);
	await member.roles.remove(role);
	return true;
};

const handleRoles = async (client, member, roleID) => {
	const server = client.guilds.cache.get(client.config.shinServerID);
	if (!roleID) {
		tatsuLog(`${member.user.username} is not eligible for any roles`);
		tatsuLog(`Tatsu runner for ${member.user.username} finished`);
		return true;
	}
	tatsuLog(`Role ID for this score is: = ${roleID}`, `This role is called: ${server.roles.cache.get(roleID).name}`);
	const level1Role = server.roles.cache.get(shinLevels.level1.roleID);
	const level2Role = server.roles.cache.get(shinLevels.level2.roleID);
	const level3Role = server.roles.cache.get(shinLevels.level3.roleID);
	const level4Role = server.roles.cache.get(shinLevels.level4.roleID);
	const level5Role = server.roles.cache.get(shinLevels.level5.roleID);

	const rolesToCheck = [level1Role, level2Role, level3Role, level4Role, level5Role];

	for (const role of rolesToCheck) {
		if (member.roles.cache.has(role.id) && role.id !== roleID) await removeRole(member, role);
		if (!member.roles.cache.has(role.id) && role.id === roleID) await addRole(member, role);
	}
	tatsuLog(`Tatsu runner for ${member.user.username} finished`);
	return true;
};

module.exports = {
	handleLevels,
	tatsuLog,
	handleAllMembers
};
