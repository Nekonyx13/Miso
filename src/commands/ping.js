// DUMMY
module.exports = {
    name: "ping",
    description: "Tests your Ping!",
    execute(message) {
        message.channel.send("This should be Pong");
    }
};