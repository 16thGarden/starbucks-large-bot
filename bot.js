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

commandPrefix = "s."
commands = [
    "help",
    "online",
    "auctions",
    "secrets",
]
commandDescriptions = [
    "display list of commands",
    "show online status of a player",
    "show pending auctions of a player",
    "show total secret count of a player"
]

const unknownCommand = require('./commands/unknownCommand.js')
const help = require('./commands/help.js')
const online = require('./commands/online.js')
const auctions = require('./commands/auctions.js')
const secrets = require('./commands/secrets.js')

function commandExists(command) {
    for (var i = 0; i < commands.length; i++) {
        if (command == commands[i]) {
            return true
        }
    }

    return false
}

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

    input = input.slice(commandPrefix.length);
    input = input.split(" ");

    command = input[0].toLowerCase()
    if (!commandExists(command)) {
        reply = unknownCommand()
        msg.channel.send(reply)
    } else if (command == "help") {
        reply = help(commands, commandDescriptions)
        msg.channel.send(reply)
    } else if (command == "online") {
        online(input[1]).then(result => {
            msg.channel.send(result)
        })
    } else if (command == "auctions") {
        auctions(input[1]).then(result => {
            msg.channel.send(result)
        })
    } else if (command == "secrets") {
        secrets(input[1]).then(result => {
            msg.channel.send(result)
        })
    }
});

client.login(process.env.BOT_TOKEN).then(() => {
    console.log("connected!");
});