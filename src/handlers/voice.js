const Discord = require('discord.js');
const { client } = require('../../index');
const ytdl = require('ytdl-core-discord');

client.queues = new Discord.Collection();
const queues = client.queues;

exports.createQueue = (guild, song) => {
    const queueConstruct = {
        voiceChannel: null,
        textChannel: null,
        connection: null,
        songs: [song],
        index: 0,
        volume: 1,
        playing: false,
        paused: false,
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
    serverQueue.textChannel.send({ embed: {
        title: "Added to Queue",
        description: song.title,
        color: "#8eedd2",
        image: {
            url: song.thumbnail,
        },
    } });
};

exports.getServerQueue = (guild) => {
    return client.queues.get(guild.id);
};

async function play(serverQueue) {
    const song = serverQueue.songs[serverQueue.index];

    if(!song) {
        serverQueue.playing = false;
        serverQueue.index = 0;
        return;
    }
    const dispatcher = serverQueue.connection
        .play(await ytdl(song.url), { type: 'opus' })
        .on("finish", () => {
            serverQueue.index++;
            play(serverQueue);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send({ embed: {
        title: "Now Playing",
        description: song.title,
        color: "#8eeda9",
        image: {
            url: song.thumbnail,
        },
    } });
}