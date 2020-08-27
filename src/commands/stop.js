module.exports = {
    name: "stop",
    description: "Stops and clears the queue!",
    aliases: ['clear'],
    usage: "",

    args: true,
    opts: false,

    async execute(message) {
        const serverQueue = message.client.queues.get(message.guild.id);
        if(!serverQueue) return;

        serverQueue.songs = [];
        serverQueue.index = 0;
        serverQueue.connection.dispatcher.end();
        return;
    }
};