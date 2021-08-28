const Discord = require('discord.js');

module.exports = function(commands, commandDescriptions) {
    replyTitle = "Available Commands:"
    replyBody = []
    commands.forEach((element, i, array) => {
        replyBody.push({
            name: "s." + element,
            value: commandDescriptions[i]
        })
    });

    return new Discord.MessageEmbed()
    .setTitle(replyTitle)
    .addFields(replyBody);
}