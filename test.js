const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config()

client.on('ready', () => {
    console.log('bot ready');
});

client.on('message', msg => {
    if (msg.channel.type == "dm") {
        if (msg.author.id == process.env.CONTROLLER_ID) {
            replyTitle = "test"
            replyBody = "123" + " :clown:"
            reply = new Discord.MessageEmbed()
            .setTitle(replyTitle)
            .setDescription(replyBody)

            msg.channel.send(reply);
            return
        }
    }
})

client.login(process.env.BOT_TOKEN).then(() => {
    console.log("connected!");
});