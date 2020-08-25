const ytdl = require('ytdl-core-discord');
const { getYouTubeSearchResults } = require("../apis/youtubeData");
const ytlist = require('youtube-playlist');

exports.resolveSong = async (arg) => {
    let url;
    if(validateYouTubeUrl(arg)) {
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

exports.resolvePlaylist = async (url) => {
    const videoUrls = await ytlist(url, 'url').then(p => p.data.playlist);
    const playlist = [];
    for await (const videoUrl of videoUrls) {
        const songInfo = await ytdl.getInfo(videoUrl);
        playlist.push({
            title: songInfo.title,
            url: songInfo.video_url,
            thumbnail: songInfo.player_response.videoDetails.thumbnail.thumbnails[2].url,
        });
    }
    return playlist;
};

function validateYouTubeUrl(url) {
    // eslint-disable-next-line no-useless-escape
    const regExp = /^.*(youtu.be\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2]) {
        return match[2];
    }
    return null;
}

exports.validatePlaylistURL = (url) => {
    // eslint-disable-next-line no-useless-escape
    const regExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2]) {
        return match[2];
    }
    return null;
};