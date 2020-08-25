module.exports = {
    name: "reload",
    description: "Reloads a command within Miso's source code (Bot-Admins Only!)",
    usage: "[command]",
    
    args: true,
    opts: true,

    minArgs: 1,

    execute(message, args, opts) {
        if(message.author.id != '282807522971222019') {
            return message.channel.send("Sorry, but you're not allowed to run this command! (Bot-Admins Only!)");
        }

        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName);

        if(!command) {
            return message.channel.send(`I couldn't find any command matching \`${commandName}\``);
        }
        delete require.cache[require.resolve(`./${commandName}`)];
        try {
            const newCommand = require(`./${commandName}`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Successfully reloaded \`${command.name}\`!`);
        }
        catch(reloadError) {
            console.error(reloadError);
            message.channel.send(`There was an error trying to reload \`${command.name}\`!`);
        }
    }
};