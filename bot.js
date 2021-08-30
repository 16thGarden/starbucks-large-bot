require('dotenv').config()

// keep app awake module
const wakeUpDyno = require('./keepAwake.js')

const express = require("express");
const port = process.env.PORT || 5000;
const dynoUrl = process.env.DYNO_URL;
const app = express();

app.listen(port, function() {
    wakeUpDyno(dynoUrl);
});

//===================================================================

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('bot ready');
});

const doCommand = require('./doCommand.js')

client.on('message', msg => {
    if (msg.author.bot) return
    input = msg.content;
    if (!input.toLowerCase().startsWith(commandPrefix)) return
    if (msg.channel.type == "dm") {
        if (msg.author.id != process.env.CONTROLLER_ID) {
            msg.channel.send("dm commands not available");
            return
        }
    }

    doCommand(client, input, msg)
});

client.login(process.env.BOT_TOKEN).then(() => {
    console.log("connected!");
});