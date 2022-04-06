const { suggestionOpen } = require('../../assets/global/colors.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'suggestmovie',
	helpTitle: 'Suggest Movie',
	category: 'Movie Night',
	usage: 'suggestmovie [movie]',
	description: 'Suggest a movie to play at movie night',
	isHidden: false,
	aliases: ['moviesuggest', 'movie-suggest', 'suggest-movie', 'moviesuggestion', 'movie-suggestion', 'mvsuggest', 'suggestmv'],
	cooldown: 30,
	execute: async function(client, message, args) {
		const { movieNightSuggestionChannelID } = client.config;

		const movie = args.slice(0).join(' ');
		if (!movie) return message.reply('So how about sugggesting a movie? You dumb fuck');

		const suggestionEmbed = new MessageEmbed()
			.setColor(suggestionOpen)
			.setTitle('Loading Suggestion')
			.setTimestamp();

		try {
			const suggestionMsg = await client.channels.cache.get(movieNightSuggestionChannelID).send({ embeds: [suggestionEmbed] });
			const suggestion = await client.movieSuggestions.create({
				movie: movie,
				suggester: message.author.id,
				suggesterTag: message.author.tag,
				suggesterAvatar: message.member.user.displayAvatarURL({ format: 'png', size: 4096, dynamic: true }),
				status: 'Pending Approval',
				suggestionMessageID: suggestionMsg.id,
			});

			if (suggestion) {
				const populatedEmbed = new MessageEmbed()
					.setColor(suggestionOpen)
					.setAuthor(suggestion.suggesterTag, suggestion.suggesterAvatar)
					.setTitle(`**${suggestion.movie}**`)
					.addField('Status:', suggestion.status)
					.setFooter(`Suggestion #${suggestion.id}`)
					.setTimestamp();

				suggestionMsg.edit({ embeds: [populatedEmbed] });
				message.channel.send('Suggestion added, thank!');

				const d = async () => new Promise(r => setTimeout(r, 260));
				await d();
				await suggestionMsg.react('⬆️');
				await d();
				await suggestionMsg.react('⬇️');
			} else {
				message.channel.send('Max foooked up.');
				return suggestionMsg.delete();
			}
		} catch (e) {
			console.error(e.stack);
			return message.channel.send('Max foooked up.');
		}
	},
};
