const { Sequelize } = require('sequelize');

const birthdaySequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: 'deployData/db/birthdays.sqlite'
});

module.exports = {
	birthdaySequelize
};
