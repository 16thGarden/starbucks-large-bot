const Discord = require('discord.js');

module.exports = function() {
    replyTitle = "Unknown Command";
    replyBody = "type s.help for help";

    return new Discord.MessageEmbed()
    .setTitle(replyTitle)
    .setDescription(replyBody)
}