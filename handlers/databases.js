const { Sequelize } = require('sequelize');

const birthdaySequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: 'deployData/db/birthdays.sqlite'
});

const movieSuggestionSequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: 'deployData/db/movieNightSuggestions.sqlite'
});

module.exports = {
	birthdaySequelize,
	movieSuggestionSequelize
};
