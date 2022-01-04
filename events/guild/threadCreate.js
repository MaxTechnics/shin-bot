module.exports = async (client, thread) => {
	if (thread.joinable) await thread.join(); // Auto join threads so the bot can be used in threads
};
