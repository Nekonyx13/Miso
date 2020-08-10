const { PREFIX } = require('../../config.json');
const { client } = require('../../index');
const { maxArgs } = require('../commands/ping');

exports.handleMessage = (message) => {
    logMessage(message);

    if (message.author.bot) {
        return;
    }
    else if (message.content.startsWith(PREFIX)) { //  TODO: CommandHandler
        const elements = message.content.slice(PREFIX.length).trim().split(/ +/);
        const commandName = elements.shift().toLowerCase();

        const args = [];
        const opts = [];

        for (const element of elements) {
            if (element.startsWith('-')) {
                opts.push(element.slice(1).toLowerCase());
            } 
            else {
                args.push(element);
            }
        }

        if (!client.commands.has(commandName)) return;

        const command = client.commands.get(commandName);

        if (args.length && !command.args) {
            return message.channel.send("You can't use any arguments with this command!");
        }
        if (args.length < command.minArgs) {
            const reply = (command.minArgs > 1) ? `You must provide at least ${command.minArgs} arguments to run this command!` : 
                `You must provide at least 1 argument to run this command!`;
            return message.channel.send(reply);
        }
        if (args.length > command.maxArgs) {
            return message.channel.send(`You can only provide a maximum of ${maxArgs} arguments with this command!`);
        }

        if(opts.length && !command.opts) {
            return message.channel.send("You can't use any options with this command!");
        }

        try {
            command.execute(message, args, opts);
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
