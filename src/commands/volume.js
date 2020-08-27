module.exports = {
    name: "volume",
    description: "Changes the volume of the music player",
    aliases: ['v', 'vol'],

    args: true,
    opts: false,

    maxArgs: 1,

    async execute(message, args) {
        const serverQueue = message.client.queues.get(message.guild.id);
        const maxVolume = 5;
        const volume = args[0].replace(',', '.');

        if(isNaN(volume) || volume < 0 || volume > maxVolume) {
            return message.channel.send(`Please provide a number between 0 und ${maxVolume} to set the volume`);
        }
        return serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 5);
    }
};