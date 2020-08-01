function handleMessage(message) {
    logMessage(message);
}

function logMessage(message) {
    console.log(`${message.author.username} sent '${message.content}'`);
}
module.exports.handleMessage = handleMessage;