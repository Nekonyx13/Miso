// DUMMY
module.exports = {
    name: "ping",
    description: "Tests the ping between you and me!",
    aliases: ['pong'],
    usage: "",

    args: true,
    opts: false,
    
    async execute(message) {
        const reply = await message.channel.send({ embed: {
            title: "Pinging...",
            color: "#f79d55",
        } });
        reply.edit({ embed: {
            title: ":ping_pong:  Pong!",
            color: "#f79d55",
            description: `Latency: ${reply.createdTimestamp - message.createdTimestamp}ms`,
        } });
    }
};