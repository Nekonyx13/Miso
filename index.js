const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();
exports.client = client;

client.commands = new Discord.Collection();

client.on('ready', async () => {
    printReadyMessage();

    await initializeEvents();
    await initializeCommands();
    await initializeLogs();

    console.info("Initialization finished!\n\n");
    console.info("Logging starts here:\n");

    client.user.setActivity("with Tofu", { type: 'PLAYING' });
});

client.login(config.TOKEN);

function printReadyMessage() {
    console.info(`Running ${config.bot_name}!`);
    console.info(`Current Verison: ${config.version}`);

    console.log("\n");
    console.info(`Successfully logged in as ${client.user.tag}`);

    console.log("\n");
}

async function initializeCommands() {
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

    console.log("Initializing Commands...");

    for (const file of commandFiles) {
        const command = require(`./src/commands/${file}`);
        client.commands.set(command.name, command);
        console.log(`   - ${command.name}`);
    }
    console.log("\n");
}

async function initializeEvents() {
    const requireAll = require("require-all");

    const files = requireAll({                
        dirname: `${__dirname}/src/eventHandlers`,
        filter: /^(?!-)(.+)\.js$/              
    });

    client.removeAllListeners();

    console.info("Initializing Events...");

    for (const name in files) {  
        const event = files[name];   
                                            
        client.on(name, event.bind(null, client));
                                                    
        console.log(`   - ${name}`);
    }   
    console.log("\n\n");
}

async function initializeLogs() {
    client.guilds.cache.forEach(guild => {
        const guildID = guild.id;
        const guildName = guild.name;
        const guildPath = `./data/logs/${guildID}`;

        console.info("Initializing Logs...");

        if (!fs.existsSync(guildPath)) {
            fs.mkdirSync(guildPath, { recursive: true });
            fs.writeFileSync(`${guildPath}/.name`, guildName);
        }

        guild.channels.cache.forEach(channel => {
            if(channel.type == "text") {
                const channelID = channel.id;
                const channelName = channel.name;
                const channelPath = `${guildPath}/${channelID}`;
                if (!fs.existsSync(channelPath)) {
                    fs.mkdirSync(channelPath);
                    fs.writeFileSync(`${channelPath}/.name`, channelName);
                }
            }
        });
        console.log("\n\n");
    });
}