const { PREFIX } = require('../../config.json');

module.exports = {
    name: "help",
    description: "Provides help in form of a list of commands, or for usage of..- Wait isn't that a little recursive!?..",
    usage: "[command]",

    args: true,
    opts: false,
    maxArgs: 1,

    execute(message, args, opts) {
        const { commands } = message.client;

        if (!args.length) {
            const helpEmbed = {
                title: "Here's a list of available commands!",
                color: "#f79d55",
                fields: [],
            };

            for(const [name, command] of commands) {
                helpEmbed.fields.push({
                    name: `${PREFIX}${name}`,
                    value: command.description,
                });
            }
            return message.channel.send({ embed: helpEmbed });
        }

        const command = commands.get(args[0].toLowerCase());

        if(!command) return message.channel.send("I don't have any help for this one, sorry");
        return message.channel.send({ embed: {
            title: command.name,
            description: command.description,
            fields: [
                {
                    name: "Usage",
                    color: "#f79d55",
                    value: `${PREFIX}${command.name} ${command.usage}`,
                }
            ]
        } });
    }
};