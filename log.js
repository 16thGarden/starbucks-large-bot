require('dotenv').config()
const Discord = require('discord.js');

module.exports = (client, msg) => {
    replyTitle = ""
    replyBody = []
    if (msg.channel.type == "dm") {
        replyTitle += "In DM"
    } else {
        replyTitle += "In Server"
        replyBody.push({
            name: "Server",
            value: msg.channel.guild.name + "\n(" + msg.channel.guild.id + ")"
        })
        replyBody.push({
            name: "Channel",
            value: msg.channel.name + "\n(" + msg.channel.id + ")"
        })
    }

    replyBody.push({
        name: "From",
        value: msg.author.username + "#" + msg.author.discriminator + "\n(" + msg.author.id + ")"
    })

    replyBody.push({
        name: "Command",
        value: msg.content
    })
    
    client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(
        new Discord.MessageEmbed()
        .setTitle(replyTitle)
        .addFields(replyBody)
    )
}