const chalk = require('chalk');
const { randomStatus } = require('../../utils/statusFunction.js');

module.exports = async (client) => {
	randomStatus(client);
	console.log(chalk.green(`Alive as ${client.user.tag}`));

	client.birthdays.sync();
};
