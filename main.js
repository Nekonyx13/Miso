const Discord = require('discord.js')
const client = new Discord.Client();

const TOKEN = "NzM4ODUwNTUzMDkzNjg1Mjk2.XyR6Mw.bPVzPT_zFr6L7i56Rs9Zbs8DHes";

client.on('ready', () => {
    console.log("Hallo, ich bin " + client.user.tag);
})

client.on('message', (receivedMessage) => {
    receivedMessage.channel.send("Haaaallo ich bin Miso");
})

client.login(TOKEN)