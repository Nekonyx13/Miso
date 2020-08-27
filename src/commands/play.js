const voice = require("../handlers/voice");
const music = require("../utils/music");
const { PREFIX } = require("../../config.json");

module.exports = {
    name: "play",
    description: "Plays a song or adds it to the queue!",
    aliases: ['p'],
    usage: "<YT-url|YT-search>",

    args: true,
    opts: false,

    async execute(message, args) {
        const guild = message.guild;

        let connection = guild.me.voice.connection;
        if(!connection) {
            if(message.member.voice.channel) {
                connection = await message.member.voice.channel.join(); 
            }
            else {
                return message.channel.send("You need to join a voice channel before playing music!");
            }
        }

        const serverQueue = voice.getServerQueue(message.guild);

        if(!args.length) {
            if(!serverQueue || !serverQueue.songs.length) {
                return message.reply("The queue is currently empty. Please add a song first!");
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
                message.channel.send(`The queue is already playing! If you want to add a song try \`${PREFIX}${this.name} ${this.usage}\``);
            }
            return;
        }

        // if(validatePlaylistURL(args.join(' '))) {
        //     const playlist = await music.resolvePlaylist(args.join(' '));
        //     if(!serverQueue) {
        //         voice.createQueue(guild);
        //     }
        //     voice.addPlaylist(guild, playlist);
        //     voice.startQueue(guild, message, connection);
        //     return;
        // }

        const song = await music.resolveSong(args.join(' '))
            .catch(error => {
                message.channel.send("Your link or search didn't fetch any results!");
                return console.error(error);
            });
        if(serverQueue && serverQueue.songs.length) {
            try {
                voice.addToQueue(guild, song);
                serverQueue.textChannel.send({ embed: {
                    title: "Added to Queue",
                    description: song.title,
                    color: "#8eedd2",
                    image: {
                        url: song.thumbnail,
                    },
                } });
            }
            catch(queueError) {
                console.error(queueError);
                message.channel.send("There was an error trying to add the song to the queue!");
            }
        } 
        else {
            voice.createQueue(guild);
            voice.addToQueue(guild, song);
            voice.startQueue(guild, message, connection);
        }
    }
};

// function validatePlaylistURL(url) {
//     const urlSearch = new URLSearchParams(url);
//     return urlSearch.has('list') || urlSearch.has('playlist') || /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/playlist.+/.test(url);
// }