const fetch = require('node-fetch');
const { valueOf } = require('ffmpeg-static');

module.exports = {
    name: "anime",
    description: "Get information about an anime from MAL",
    args: true,
    opts: false,

    minArgs: 0,

    async execute(message, args) {
        const animeQuery = args.join(' ');
        await fetch(`https://api.jikan.moe/v3/search/anime?q=${animeQuery}&page=1`)
            .then(response => response.json())
            .then(async json => {
                const result = json.results[0];
                const animeMessage = await message.channel.send({ embed: {
                    title: result.title,
                    color: '#9ef2ff',
                    thumbnail: {
                        url: result.image_url,
                    },
                    fields: [
                        {
                            name: "Score",
                            value: result.score,
                            inline: true,
                        },
                        {
                            name: "Episodes",
                            value: result.episodes,
                            inline: true,
                        },
                        {
                            name: "Description",
                            value: result.synopsis,
                        },
                    ],
                    footer: {
                        text: `React with 'ℹ' for more information`,
                    }
                } });
                animeMessage.react('ℹ');
                const filter = (reaction, user) => {
                    return reaction.emoji.name === 'ℹ' && user.id === message.author.id;
                };

                const collector = animeMessage.createReactionCollector(filter, { time: 15000 });
                collector.on('collect', (reaction, user) => {
                    fetch(`https://api.jikan.moe/v3/anime/${result.mal_id}/`)
                        .then(response => response.json())
                        .then(res => {
                            animeMessage.edit({ embed: animeMessage.embeds[0].spliceFields(2, 1, { 
                                name: "Description",
                                value: res.synopsis,
                            })
                                .setFooter("")
                            });
                        });

                });
            })
            .catch(error => {
                message.reply(`Sorry, your search for ${animeQuery} didn't fetch any results`);
                console.error(error);
            });
    }
};