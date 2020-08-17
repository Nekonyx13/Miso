const join = require("../commands/join");
const ytdl = require('ytdl-core-discord');
const { getYouTubeSearchResults } = require("../apis/youtubeData");

module.exports = {
    name: "play",
    description: "Play a song using a YouTube Link!",
    args: true,
    opts: false,

    async execute(message, args) {
        const connection = await join.execute(message, []);
        const queues = message.client.queues;
        let serverQueue = queues.get(message.guild.id);

        let url = args[0];

        if(!isValidURL(url)) {
            const search = await getYouTubeSearchResults(args.join(" "), 1);
            const id = search.items[0].id.videoId;
            url = `https://www.youtube.com/watch?v=${id}`;
        }

        const songInfo = await ytdl.getInfo(url);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
        };

        if(serverQueue) {
            serverQueue.songs.push(song);
            return message.reply(`Added **${song.title}** to the Queue!`);
        }
        else {
            const queueConstruct = {
                voiceChannel: connection.channel,
                textChannel: message.channel,
                connection: connection,
                songs: [],
                volume: 1,
                playing: true,
            };
            queues.set(message.guild.id, queueConstruct);
            serverQueue = queues.get(message.guild.id);
            serverQueue.songs.push(song);            
            play(message.guild, serverQueue);
        }
    }
};

async function play(guild, serverQueue) {
    const song = serverQueue.songs[0];
    if(!song) {
        return serverQueue.voiceChannel.leave();
    }
    const dispatcher = serverQueue.connection
        .play(await ytdl(song.url), { type: 'opus' })
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

function isValidURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}