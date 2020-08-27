module.exports = {
    name: "skip",
    description: "Skips one or multiple tracks in the queue",
    aliases: ['next'],
    usage: "[amount]",

    args: true,
    opts: false,
    
    async execute(message, args) {
        const serverQueue = message.client.queues.get(message.guild.id);
        if(!serverQueue) return;

        const amount = (args.length || !isNaN(args[0])) ? args[0] : 1;

        serverQueue.index--; // .end() already adds 1 to the index
        serverQueue.connection.dispatcher.end();
        for (let i = 0; i < amount; i++) {
            serverQueue.index++;
            if(serverQueue.index > serverQueue.songs.length - 1) {
                if(serverQueue.looping) {
                    serverQueue.index = 0;
                    continue;
                }
                serverQueue.index = serverQueue.songs.length;
                break;
            }        
        }
    }
};