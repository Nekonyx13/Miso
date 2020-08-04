const { PREFIX } = require('../../config.json');
const { client } = require('../../index');

exports.handleMessage = (message) => {
    logMessage(message);

    if (message.author.bot) {
        return;
    }
    else if (message.content.startsWith(PREFIX)) { //  TODO: CommandHandler
        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (!client.commands.has(command)) {
            return;
        }
        try {
            client.commands.get(command).execute(message, args);
        }
        catch (cmdError) {
            console.error(cmdError);
            message.reply("There was an error trying to execute this command!");
        }
    }
    else {
        return; // TODO: Custom Reactions
    }
};

function logMessage(message) {
    console.log(`${message.author.username} sent '${message.content}'`);
    //  TODO: Proper Logging through Chatfiles
}
