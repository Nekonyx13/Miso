module.exports = {
    name: "back",
    description: "Jumps back to the previous song in the queue!",
    args: true,
    opts: false,

    maxArgs: 1,

    async execute(message, args) {
        const serverQueue = message.client.queues.get(message.guild.id);

        if(serverQueue.index < 1) {
            return message.reply("This is already the first song in the queue!");
        }
        serverQueue.index -= 2; // .end() already adds 1 to the index
        serverQueue.connection.dispatcher.end(); 
    }
};