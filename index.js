const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();
exports.client = client;
client.commands = new Discord.Collection();

const { handleMessage } = require('./src/handlers/messageHandler');


client.on('ready', async () => { // TODO: printReadyMessage
    console.info(`Running ${config.bot_name}!`);
    console.info(`Current Verison: ${config.version}`);
    console.log("\n\n");

    await initializeCommands();
    await initializeLogs();

    console.info(`Successfully logged in as ${client.user.tag}`);

    client.user.setActivity("with Tofu", { type: 'PLAYING' });
});

client.on('message', (receivedMessage) => {
    handleMessage(receivedMessage);
});


async function initializeCommands() {
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

    console.log("Initializing Commands...");

    for (const file of commandFiles) {
        const command = require(`./src/commands/${file}`);
        client.commands.set(command.name, command);
        console.log(`   - ${command.name}`);
    }
    console.log("\n\n");
}

async function initializeLogs() {
    client.guilds.cache.forEach(guild => {
        const guildID = guild.id;
        const guildName = guild.name.replace(/[|&;$%@"<>()+,]/g, "_");
        const guildPath = `./data/logs/${guildID}`;

        if (!fs.existsSync(guildPath)) {
            fs.mkdirSync(guildPath, { recursive: true });
            fs.mkdirSync(`${guildPath}/.${guildName}`);
        }

        guild.channels.cache.forEach(channel => {
            if(channel.type == "text") {
                const channelID = channel.id;
                const channelName = channel.name.replace(/[|&;$%@"<>()+,]/g, "_");
                const channelPath = `${guildPath}/${channelID}`;
                if (!fs.existsSync(channelPath)) {
                    fs.mkdirSync(channelPath);
                    fs.mkdirSync(`${channelPath}/.${channelName}`);
                }
            }
        });
    });
}

client.login(config.TOKEN);