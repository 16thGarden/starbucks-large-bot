const Discord = require('discord.js');

module.exports = function(prefix) {
    replyTitle = "Unknown Command";
    replyBody = "type " + prefix + "help or " + prefix + "h for help";

    return new Discord.MessageEmbed()
    .setTitle(replyTitle)
    .setDescription(replyBody)
}