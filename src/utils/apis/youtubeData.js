const fetch = require('node-fetch');
const querystring = require('querystring');
const { YOUTUBE_API_KEY } = require("../../../secrets.json");

exports.getYouTubeSearchResults = async (searchTerm, maxResults) => {
    const url = ["https://www.googleapis.com/youtube/v3/search?", 
        querystring.stringify({ 
            part: 'snippet',
            maxResults: maxResults,
            order: 'relevance',
            q: searchTerm,
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