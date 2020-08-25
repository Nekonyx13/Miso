const fetch = require('node-fetch');
const querystring = require('querystring');
const { YOUTUBE_API_KEY } = require("../../secrets.json");
const ytlist = require('youtube-playlist');

exports.getYouTubeSearchResults = async (searchTerm, maxResults) => {
    const url = ["https://www.googleapis.com/youtube/v3/search?", 
        querystring.stringify({ 
            part: 'snippet',
            maxResults: maxResults,
            order: 'relevance',
            q: searchTerm,
            type: 'video',
            key: YOUTUBE_API_KEY,
        })
    ].join("");

    try {
        const response = await fetch(url);
        return response.json();
    } 
    catch(APIError) {
        console.log(APIError);
    }
};

exports.getYouTubePlaylistLinks = async (url) => {
    return await ytlist(url, ['name', 'url']);
};