const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config()

client.on('ready', () => {
    console.log('bot ready');
});

client.on('message', msg => {
    if (msg.channel.type == "dm") {
        if (msg.author.id == process.env.CONTROLLER_ID) {
            channel = client.channels.cache.get(msg.channel.id)

            channel.messages.fetch({ limit: 100 }).then(messages => {
                console.log(`Received ${messages.size} messages`)
                messages.forEach(message => console.log(message.content))
            })
        }
    }
})

client.login(process.env.BOT_TOKEN).then(() => {
    console.log("connected!");
});