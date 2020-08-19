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

        if(serverQueue.playing) {
            serverQueue.connection.dispatcher.pause();
            serverQueue.playing = false;
        } 
        else {
            serverQueue.connection.dispatcher.resume();
            serverQueue.playing = true;
        }
    }
};