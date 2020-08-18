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
        volume: 1,
        playing: true,
    };
    queues.set(guild.id, queueConstruct);    
};

exports.playQueue = (guild, message, connection) => {
    const serverQueue = queues.get(guild.id);
    serverQueue.voiceChannel = connection.channel;
    serverQueue.textChannel = message.channel;
    serverQueue.connection = connection, 

    play(serverQueue);
};

exports.addToQueue = (guild, song) => {
    const serverQueue = queues.get(guild.id);
    serverQueue.songs.push(song);
};

exports.getServerQueue = (guild) => {
    return client.queues.get(guild.id);
};

async function play(serverQueue) {
    const song = serverQueue.songs[0];
    if(!song) {
        return serverQueue.voiceChannel.leave();
    }
    const dispatcher = serverQueue.connection
        .play(await ytdl(song.url), { type: 'opus' })
        .on("finish", () => {
            serverQueue.songs.shift();
            play(serverQueue);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}