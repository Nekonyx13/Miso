// DUMMY
module.exports = {
    name: "ping",
    description: "Tests your Ping!",
    args: false,
    opts: false,
    
    execute(message) {
        message.channel.send("This should be Pong");
    }
};