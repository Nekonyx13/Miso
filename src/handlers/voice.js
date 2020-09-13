const Discord = require('discord.js');
const { client } = require('../../index');
const ytdl = require('ytdl-core-discord');
const { PREFIX } = require("../../config.json");

client.queues = new Discord.Collection();
const queues = client.queues;

exports.createQueue = (guild) => {
    const queueConstruct = {
        voiceChannel: null,
        textChannel: null,
        connection: null,
        songs: [],
        index: 0,
        volume: 1,
        playing: false,
        paused: false,
        looping: false,
    };
    queues.set(guild.id, queueConstruct);    
};

exports.startQueue = (guild, message, connection) => {
    const serverQueue = queues.get(guild.id);
    serverQueue.voiceChannel = connection.channel;
    serverQueue.textChannel = message.channel;
    serverQueue.connection = connection,
    serverQueue.playing = true, 

    play(serverQueue);
};

exports.addToQueue = (guild, song) => {
    const serverQueue = queues.get(guild.id);
    serverQueue.songs.push(song);
};

exports.addPlaylist = async (guild, playlist) => {
    const serverQueue = queues.get(guild.id);
    playlist.forEach(song => {
        serverQueue.songs.push(song);
        console.log(`Added to Queue: **${song.title}**`);
    });
};

exports.getServerQueue = (guild) => {
    return client.queues.get(guild.id);
};

async function play(serverQueue) {
    const song = serverQueue.songs[serverQueue.index];

    if(!song) {
        serverQueue.index = 0;
        if(serverQueue.looping) {
            return play(serverQueue);   
        }
        serverQueue.textChannel.send({ embed: {
            title: "Reached end of Queue",
            description: `If you want to play the queue again use \`${PREFIX}play\``,
            color: "#f54e4e",
        } });
        return serverQueue.playing = false;
    }
    const dispatcher = serverQueue.connection
        .play(await ytdl(song.url), { type: 'opus' })
        .on("finish", () => {
            serverQueue.index++;
            setTimeout(function() { // To prevent exceeding stack size
                play(serverQueue); 
            }, 0);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send({ embed: {
        title: "Now Playing",
        description: song.title,
        color: "#8eeda9",
        fields: [
            {
                name: "Length",
                value: song.length
            }
        ],
        thumbnail: {
            url: song.thumbnail,
        },
    } });
}