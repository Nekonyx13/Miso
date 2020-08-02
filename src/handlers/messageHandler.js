const config = require('../../config.json');
// const { handleCommand } = require()

exports.handleMessage = (message) => {
    logMessage(message);

    if (message.author.bot) {
        return;
    }
    else if (message.content.startsWith(config.PREFIX)) {
        let command = message.content.split('\\s+');

        message.channel.send("Sorry, I don't recognize this one...");
    }
    else {
        return; // TODO: Custom Reactions
    }
};

function logMessage(message) {
    console.log(`${message.author.username} sent '${message.content}'`);
}
