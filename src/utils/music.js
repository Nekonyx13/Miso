const ytdl = require('ytdl-core-discord');
const { getYouTubeSearchResults } = require("../apis/youtubeData");
const { YOUTUBE_API_KEY } = require("../../secrets.json");
const ytlist = require('youtube-playlist');
const ytsearch = require('youtube-search');

exports.resolveSong = async (arg) => {
    let url = arg;
    const host = resolveHost(arg);
    switch(host) {
    case 'search': {
        const search = await ytsearch(arg, { 
            maxResults: 1,
            order: 'relevance',
            type: 'video',
            key: YOUTUBE_API_KEY,
        });
        url = search.results[0].link;
        break;
    }
    case 'spotify': {
        // DUMMY
    }
    }
    const songInfo = await ytdl.getBasicInfo(url);
    return {
        title: songInfo.title,
        url: songInfo.video_url,
        thumbnail: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
    };
};

exports.resolvePlaylist = async (arg) => {
    const host = resolveHost(arg);
    switch(host) {
    case 'youtube': {
        const videoUrls = await ytlist(arg, 'url').then(p => p.data.playlist);
        const playlist = [];
        for await (const videoUrl of videoUrls) {
            const songInfo = await ytdl.getBasicInfo(videoUrl);
            playlist.push({
                title: songInfo.title,
                url: songInfo.video_url,
                thumbnail: songInfo.player_response.videoDetails.thumbnail.thumbnails[2].url,
            });
        }
        return playlist;
    }
    case 'spotify': {
        // DUMMY
    }
    }
};

function resolveHost(arg) {
    const YTRegEx = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
    const SPRegEx = /^(http(s)?:\/\/)?(open.)?spotify?(\.com)?\/.+/;
    if(YTRegEx.test(arg)) {
        return 'youtube';
    }
    if(SPRegEx.test(arg)) {
        return 'spotify';
    }
    return 'search';
}