const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config()

client.on('ready', () => {
    console.log('bot ready');
});

client.on('message', msg => {
    console.log(msg.author)
})

client.login(process.env.BOT_TOKEN).then(() => {
    console.log("connected!");
});