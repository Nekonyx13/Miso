module.exports = {
    name: "loop",
    description: "Toggles the repeat-mode of the queue",
    aliases: ['l', 'repeat'],
    usage: "",

    args: false,
    opts: false,

    async execute(message) {
        const serverQueue = message.client.queues.get(message.guild.id);
        if(!serverQueue) return;

        serverQueue.looping = !serverQueue.looping;
        if(serverQueue.looping) {
            return message.channel.send("Looping the queue!");
        }
        return message.channel.send("Stopped looping the queue!");
    }
};