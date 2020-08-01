const { Client } = require('discord.js');
const { config } = require('dotenv');

const client = new Client();
const messageHandler = require('./src/handlers/message-handler');

config({
    path: __dirname + "/.env"
});


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    client.user.setStatus('idle');
    client.user.setActivity("with Tofu", { type: 'PLAYING' });
});

client.on('message', (receivedMessage) => {
    if (receivedMessage.author != client.user) {
        messageHandler.handleMessage(receivedMessage);
    }
});

client.login(process.env.TOKEN);