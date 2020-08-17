module.exports = {
    name: "join",
    description: "Let me join ur voice channel owo",
    args: true,
    opts: false,

    maxArgs: 1,

    async execute(message, args) {
        if(!args.length) {
            if (message.member.voice.channel) {
                return await message.member.voice.channel.join();
            } 
            else {
                message.reply("Hey, you aren't even inside a voice channel!");
            }
        }
    }
};