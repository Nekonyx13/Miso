const querystring = require('querystring');
const fetch = require('node-fetch');
const Discord = require('discord.js');

const CAT_API_KEY = "77754d84-55e9-48bd-a31e-853ba386ec6e";
const CAT_API_URL = 'https://api.thecatapi.com/';

module.exports = {
    name: "cat",
    description: "Sends a random cat image! Mreeeow!",
    async execute(message) {
        const images = await loadImage();
        const image = images[0];
        const breed = image.breeds[0];

        const file = new Discord.MessageAttachment(image.url);

        const catEmbed = {
            title: `Here's a ${breed.name}!`,
            image: {
                url: file.attachment
            },
        };

        message.channel.send({ embed: catEmbed });
    }
};

async function loadImage() {
    const header = {
        'X-API-KEY': CAT_API_KEY
    };

    const queryParams = {
        'has_breeds': true,
        'size': "full",
        'limit': 1
    };

    const queryString = querystring.stringify(queryParams);

    try {
        const _url = CAT_API_URL + `v1/images/search?${queryString}`;
        return await fetch(_url, { header }).then(response => response.json());
    }
    catch (imgError) {
        console.error(imgError);
    }
}
