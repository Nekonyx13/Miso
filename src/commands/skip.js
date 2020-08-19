module.exports = {
    name: "skip",
    description: "Skip a song in the queue!",
    args: true,
    opts: false,

    maxArgs: 1,

    async execute(message, args) {
        const serverQueue = message.client.queues.get(message.guild.id);
        return serverQueue.connection.dispatcher.end();
    }
};