const fs = require('fs');

module.exports.logMessage = (message) => {
    const guildID = message.guild.id;
    const channelID = message.channel.id;
    const dateString = formatDateString(new Date());
    const logPath = `./data/logs/${guildID}/${channelID}/${dateString}.log`;

    if(!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, message.content + '\n');
    } 
    else {
        fs.appendFileSync(logPath, message.content + '\n');
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