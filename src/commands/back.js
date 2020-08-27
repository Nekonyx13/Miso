module.exports = {
    name: "back",
    description: "Goes back one or multiple tracks in the queue",
    aliases: ['previous', 'last'],
    usage: "[amount]",

    args: true,
    opts: false,

    async execute(message, args) {
        const serverQueue = message.client.queues.get(message.guild.id);
        const amount = (args.length && !isNaN(args[0])) ? args[0] : 1;

        if(serverQueue.index < 1 && !serverQueue.looping) {
            return message.channel.send("This is already the first song in the queue!");
        }
        serverQueue.connection.dispatcher.end(); 
        for (let i = 0; i <= amount; i++) {
            serverQueue.index--;
            if(serverQueue.index < 0) {
                if(serverQueue.looping) {
                    serverQueue.index = serverQueue.songs.length - 1;
                    continue;
                }
                serverQueue.index = -1;
                break;
            }
        }
    }
};