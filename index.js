const { Client } = require('discord.js');
const { TOKEN } = require('./config.json');

const client = new Client();
const { handleMessage } = require('./src/handlers/messageHandler');


client.on('ready', () => {
    console.log(`Successfully logged in as ${client.user.tag}!`);

    client.user.setActivity("with Tofu", { type: 'PLAYING' });
});

client.on('message', (receivedMessage) => {
    handleMessage(receivedMessage);
});

client.login(TOKEN);