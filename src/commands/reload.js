module.exports = {
    name: "reload",
    description: "Reloads a command within the Miso's source code (Bot-Owner ONLY!)",
    args: true,
    opts: true,

    minArgs: 1,

    execute(message, args, opts) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName);

        if(!command) {
            return message.reply(`I couldn't find any command matching \`${commandName}\``);
        }
        delete require.cache[require.resolve(`./${commandName}`)];
        try {
            const newCommand = require(`./${commandName}`);
            message.client.commands.set(newCommand.name, newCommand);
            message.reply(`Successfully reloaded \`${command.name}\`!`);
        }
        catch(reloadError) {
            console.error(reloadError);
            message.reply(`There was an error trying to reload \`${command.name}\`!`);
        }
    }
};