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
        
        if(!args.length) {
            if(!serverQueue || !serverQueue.songs.length) {
                return message.reply("The queue is currently empty, please add a song first!");
            }  
            if(!serverQueue.playing) {
                voice.startQueue(guild, message, connection);
            }
            else {
                if(connection.dispatcher.paused) {
                    connection.dispatcher.resume();
                    serverQueue.paused = false;
                    return;
                }
                message.reply(`The Queue is already playing!\n If you want to add a song try m.play [searchTerm/Link]`);
            }
            return;
        }


        if(serverQueue) {
            if(!args.length && serverQueue.playing) {
                return message.reply("The Queue is already playing! Please provide an argument to add a song!");
            }
            if(!args.length) {
                if(!serverQueue.songs.length) {
                    return message.reply("The Queue is currently empty! Please add a song first!");
                }
                serverQueue.index = 0;
                return voice.startQueue(guild, message, connection);
            }

            const song = await music.resolveYouTubeSong(args.join(" "));
            try {
                voice.addToQueue(guild, song);
            }
            catch(queueError) {
                console.error(queueError);
                message.reply("Failed to add to Queue!");
            }
        } 
        else {
            const song = await music.resolveYouTubeSong(args.join(" "));
            voice.createQueue(guild, song);
            voice.startQueue(guild, message, connection);
        }
    }
};