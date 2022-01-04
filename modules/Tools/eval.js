const { softGreen, Red } = require('../../assets/global/colors.json');
const { maxID, shrimpID } = require('../../assets/global/memberIDs.json');
const { MessageEmbed } = require('discord.js');
const beautify = require('beautify');

module.exports = {
	name: 'evil',
	helpTitle: 'Evil eval',
	category: 'Tools',
	usage: 'evil [string]',
	description: 'Evaluates JavaScript code inputed from args.\nOnwer Only Command\nSelfnote: don\'t use this next to many people idk they could take your token i guess lmao',
	isHidden: true,
	cooldown: 0,
	execute: async function(client, message, args) {
		if (![shrimpID, maxID].includes(message.author.id)) return message.channel.send('No dude. I don\'t want anyone but my masters mess with code in the bot...');

		if (!args[0]) return message.channel.send('Give me something to evaluate tho');

		try {
			const toEval = args.join(' ');
			let evaluated = eval(toEval);
			evaluated = (evaluated + '').replace(client.token, 'funny token time');
			if (['token', 'key', 'apikey'].includes(toEval.toLowerCase())) return message.channel.send('oh nononono you\'re not getting the token you\'re NOT GETTING IT IDNFIABGDJDNWIKG');

			const embed = new MessageEmbed()
				.setColor(softGreen)
				.setTimestamp()
				.setTitle('Eval')
				.addField('To Evaluate', `\`\`\`js\n${beautify(toEval, { format: 'js' })}\n\`\`\``)
				.addField('Evaluated', `${evaluated}`)
				.addField('Type of', typeof (evaluated))
				.setFooter(client.user.username, client.user.displayAvatarURL);

			message.channel.send({ embeds: [embed] });
		} catch (e) {
			const embed = new MessageEmbed()
				.setColor(Red)
				.setTitle('Error')
				.setDescription(e.toString())
				.setFooter(client.user.username, client.user.displayAvatarURL);

			message.channel.send({ embeds: [embed] });
		}

		// ... all your eval shit
	},
};
