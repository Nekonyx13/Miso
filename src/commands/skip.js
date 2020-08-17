module.exports = {
    name: "skip",
    description: "Skip a song in the queue!",
    args: true,
    opts: false,

    maxArgs: 1,

    async execute(message, args) {
        const queues = message.client.queues;
        const serverQueue = queues.get(message.guild.id);
        return serverQueue.connection.dispatcher.end();
    }
};