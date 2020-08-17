module.exports = {
    name: "skip",
    description: "Play a song using a YouTube Link!",
    args: true,
    opts: false,

    maxArgs: 1,

    async execute(message, args) {
        const queues = message.client.queues;
        const serverQueue = queues.get(message.guild.id);
        return serverQueue.connection.dispatcher.end();
    }
};