const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();
exports.client = client;
client.commands = new Discord.Collection();

const { handleMessage } = require('./src/handlers/messageHandler');


client.on('ready', () => { // TODO: printReadyMessage
    console.log(`Running ${config.bot_name}!`);
    console.log(`Current Verison: ${config.version}`);
    console.log("\n\n");

    initializeCommands();

    console.log(`Successfully logged in as ${client.user.tag}`);

    client.user.setActivity("with Tofu", { type: 'PLAYING' });
});

client.on('message', (receivedMessage) => {
    handleMessage(receivedMessage);
});

function initializeCommands() {
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

    console.log("Initializing Commands...");

    for (const file of commandFiles) {
        const command = require(`./src/commands/${file}`);
        client.commands.set(command.name, command);
        console.log(`   - ${command.name}`);
        console.log("\n\n");
    }
}

client.login(config.TOKEN);