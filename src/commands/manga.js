/* eslint-disable no-useless-escape */
const fetch = require('node-fetch');

module.exports = {
    name: "manga",
    description: "Get information about a manga from [MyAnimeList](www.myanimelist.net)",
    aliases: [],
    usage: "<search>",
    
    args: true,
    opts: false,
    minArgs: 1,

    async execute(message, args) {
        const query = args.join(' ');
        await fetch(`https://api.jikan.moe/v3/search/manga?q=${query}&page=1`)
            .then(response => response.json())
            .then(async json => {
                const result = json.results[0];
                const reply = await message.channel.send({ embed: {
                    title: result.title,
                    color: '#9ef2ff',
                    url: result.url,
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
                            name: "Chapters",
                            value: result.chapters,
                            inline: true,
                        },
                        {
                            name: "Synopsis",
                            value: result.synopsis + "\n \u200B", // For extra space
                        },
                        {
                            name: "Start Date",
                            value: result.start_date.slice(0, result.start_date.indexOf('T')),
                            inline: true,
                        },
                        {
                            name: "End Date",
                            value: (result.end_date) ? result.end_date.slice(0, result.end_date.indexOf('T')) : "Ongoing",
                            inline: true,
                        },
                    ],
                    footer: {
                        text: `React with [ ℹ ] for more information`,
                    }
                } });
                const filter = (reaction, user) => {
                    return reaction.emoji.name === 'ℹ' && user.id === message.author.id;
                };
                const collector = reply.createReactionCollector(filter, { time: 15000 });

                await collector.on('collect', async () => {
                    const moreEmbed = reply.embeds[0];
                    moreEmbed.setFooter("");

                    if(result.synopsis.endsWith("...")) {
                        await fetch(`https://api.jikan.moe/v3/manga/${result.mal_id}/`)
                            .then(response => response.json())
                            .then(res => {
                                if(res.synopsis.length < 1024) {
                                    moreEmbed.spliceFields(2, 1, { 
                                        name: "Synopsis",
                                        value: res.synopsis + "\n \u200B", // For extra space
                                    });
                                }
                                else {
                                    const splitIndex = res.synopsis.lastIndexOf('.', 1023) + 1;
                                    const synopsis1 = res.synopsis.substr(0, splitIndex);
                                    const synopsis2 = res.synopsis.substr(splitIndex).replace(/(\(|\[).*?(\)|])/g, "");
    
                                    moreEmbed
                                        .spliceFields(2, 1, { 
                                            name: "Synopsis",
                                            value: synopsis1,
                                        })
                                        .spliceFields(3, 0, {
                                            name: '\u200B',
                                            value: synopsis2 + "\n \u200B", // For extra space
                                        });
                                }
                            });
                    }
                    reply.edit({ embed: moreEmbed });
                    collector.stop();
                });
                reply.react('ℹ');
            })
            .catch(error => {
                message.channel.send(`Sorry, your search for \`"${query}"\` didn't fetch any results`);
                console.error(error);
            });
    }
};