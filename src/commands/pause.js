module.exports = {
    name: "pause",
    description: "Pauses the music player",
    aliases: [],
    usage: "",
    
    args: false,
    opts: false,

    maxArgs: 1,

    async execute(message) {
        const serverQueue = message.client.queues.get(message.guild.id);

        if(!serverQueue || !serverQueue.playing) {
            return message.reply("You can't pause the playback if nothing's being played!");
        }
        (serverQueue.paused) ? serverQueue.connection.dispatcher.resume()
            : serverQueue.connection.dispatcher.pause();
        serverQueue.paused = !serverQueue.paused;
    }
};