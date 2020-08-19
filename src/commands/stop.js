module.exports = {
    name: "stop",
    description: "Stops and clears the queue!",
    args: true,
    opts: false,

    maxArgs: 1,

    async execute(message, args) {
        const serverQueue = message.client.queues.get(message.guild.id);
        serverQueue.songs = [];
        serverQueue.index = 0;
        serverQueue.connection.dispatcher.end();
        return;
    }
};