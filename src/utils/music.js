const ytdl = require('ytdl-core-discord');
const { isValidURL } = require("./utils");
const { getYouTubeSearchResults } = require("./apis/youtubeData");

exports.resolveYouTubeSong = async (arg) => {
    let url;

    if(isValidURL(arg)) {
        url = arg;
    }
    else {
        const search = await getYouTubeSearchResults(arg, 1);
        const id = search.items[0].id.videoId;
        url = `https://www.youtube.com/watch?v=${id}`;
    }

    const songInfo = await ytdl.getInfo(url);
    return {
        title: songInfo.title,
        url: songInfo.video_url,
        thumbnail: songInfo.player_response.videoDetails.thumbnail.thumbnails[2].url,
    };
};