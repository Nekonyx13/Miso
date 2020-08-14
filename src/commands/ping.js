// DUMMY
module.exports = {
    name: "ping",
    description: "Tests your Ping!",
    args: false,
    opts: false,

    usage: "",
    
    async execute(message) {
        const reply = await message.channel.send({ embed: {
            title: "Pinging...",
        } });
        reply.edit({ embed: {
            title: "Pong!",
            description: `Latency: ${reply.createdTimestamp - message.createdTimestamp}ms`,
        } });
    }
};