const fs = require('fs');

module.exports.logMessage = (message) => {
    const guildID = message.guild.id;
    const channelID = message.channel.id;
    const dateString = formatDateString(new Date());
    const logPath = `./data/logs/${guildID}/${channelID}/${dateString}.log`;

    const logString = `${message.author.tag} - (${message.createdAt.getHours()}:${message.createdAt.getMinutes()})\n    ${message.content}\n`;

    if(!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, logString);
    } 
    else {
        fs.appendFileSync(logPath, logString);
    }
};

function formatDateString(date) {
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    return [date.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd]
        .join('-');
}