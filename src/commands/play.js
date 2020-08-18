const join = require("../commands/join");
const voice = require("../handlers/voice");
const music = require("../utils/music");

module.exports = {
    name: "play",
    description: "Play a song from YouTube or add it to the queue!",
    args: true,
    opts: false,

    async execute(message, args) {
        const guild = message.guild;

        let connection = guild.me.voice.connection;
        if(!connection) {
            connection = await join.execute(message, []);    
        }
        
        const serverQueue = voice.getServerQueue(message.guild);
        const song = await music.resolveYouTubeSong(args.join(" "));
        
        if(serverQueue) {
            voice.addToQueue(guild, song);
            message.channel.send({ embed: {
                title: "Added to Queue",
                description: song.title,
                image: {
                    url: song.thumbnail,
                },
            } });
        } 
        else {
            voice.createQueue(guild, song);
            voice.playQueue(guild, message, connection);
        }
    }
};