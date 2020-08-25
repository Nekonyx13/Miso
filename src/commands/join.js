module.exports = {
    name: "join",
    description: "Automatically summons me to a voice channel",
    usage: "[user|voiceChannel]",

    args: true,
    opts: false,

    async execute(message, args) {
        let channel;
        const mentionedMember = message.mentions.members.first();
        const mentionedChannel = (isNaN(args[0])) ? message.guild.channels.cache.find(voice => voice.name === args[0])
            : message.guild.channels.cache.get(voice => voice.name === args[0]);

        if(!args.length || (!mentionedMember && (!mentionedChannel || mentionedChannel.type !== 'voice'))) {
            if (message.member.voice.channel) {
                channel = message.member.voice.channel;
                if(channel === message.guild.me.voice.channel && message.guild.me.voice.channel.connection) {
                    return message.channel.send("Heeelloo, I'm already in your voice channel!");
                }
            }
            else {
                return message.reply("Hey, you need to join a voice channel first!");
            }
        } 
        else if(mentionedMember && mentionedMember.voice.channel) {
            channel = mentionedMember;
        } 
        else if(mentionedChannel && mentionedChannel.type == 'voice') {
            channel = mentionedChannel;
        }
        if(channel === message.guild.me.voice.channel) {
            return message.channel.send("I'm already in that voice channel!");
        }
        if (message.guild.me.voice.channel) {
            return await channel.join()
                .then(message.channel.send(`Successfully moved to the \`${channel.name}\` channel!`));
        }
        return await channel.join()
            .then(message.channel.send(`Successfully joined the \`${channel.name}\` channel!`));
    }
};