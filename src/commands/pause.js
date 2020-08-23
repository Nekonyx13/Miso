module.exports = {
    name: "pause",
    description: "Pauses the queue",
    args: false,
    opts: false,

    maxArgs: 1,

    async execute(message, args) {
        const serverQueue = message.client.queues.get(message.guild.id);

        if(!serverQueue) {
            return message.reply("You can't pause me if I have nothing to play");
        }

        if(!serverQueue.paused) {
            serverQueue.connection.dispatcher.pause();
            serverQueue.paused = true;
        } 
        else {
            serverQueue.connection.dispatcher.resume();
            serverQueue.paused = false;
        }
    }
};