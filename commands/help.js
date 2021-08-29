const Discord = require('discord.js');

module.exports = function(prefix, commands, commandDescriptions) {
    replyTitle = "Available Commands:"
    replyBody = []
    commandDescriptions.forEach((element, i, array) => {
        replyBody.push({
            name: prefix + commands[i * 2] + " (alias " + prefix + commands[i * 2 + 1] + ")",
            value: commandDescriptions[i]
        })
    });

    return new Discord.MessageEmbed()
    .setTitle(replyTitle)
    .addFields(replyBody);
}