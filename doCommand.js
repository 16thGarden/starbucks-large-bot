commandPrefix = "s."
commands = [
    "help", "h",
    "online", "o",
    "auctions", "a",
    "secrets", "s",
    "calendar", "c",
    "resend", "r",
]
commandDescriptions = [
    "display list of commands",
    "show online status of a player",
    "show pending auctions of a player",
    "show total secret count of a player",
    "show current and upcoming events",
    "resend the last command sent in this channel within 100 messages",
]

function commandExists(command) {
    for (var i = 0; i < commands.length; i++) {
        if (command == commands[i]) {
            return true
        }
    }

    return false
}

const unknownCommand = require('./commands/unknownCommand.js')
const help = require('./commands/help.js')
const online = require('./commands/online.js')
const auctions = require('./commands/auctions.js')
const secrets = require('./commands/secrets.js')
const calendar = require('./commands/calendar.js')
const resend = require('./commands/resend.js');

const Discord = require('discord.js');
bufferReply = new Discord.MessageEmbed().setDescription("retrieving data...")

doCommand = (client, input, msg) => {
    input = input.slice(commandPrefix.length);
    input = input.split(" ");
    command = input[0].toLowerCase()

    if (!commandExists(command)) {
        reply = unknownCommand(commandPrefix)
        msg.channel.send(reply)
    } else if (command == commands[0] || command == commands[1]) {
        reply = help(commandPrefix, commands, commandDescriptions)
        msg.channel.send(reply)
    } else if (command == commands[2] || command == commands[3]) {
        msg.channel.send(bufferReply).then(sentMessage => {
            online(input[1]).then(result => {
                sentMessage.edit(result)
            })
        })
    } else if (command == commands[4] || command == commands[5]) {
        msg.channel.send(bufferReply).then(sentMessage => {
            auctions(input[1]).then(result => {
                sentMessage.edit(result)
            })
        })
    } else if (command == commands[6] || command == commands[7]) {
        msg.channel.send(bufferReply).then(sentMessage => {
            secrets(input[1]).then(result => {
                sentMessage.edit(result)
            })
        })
    } else if (command == commands[8] || command == commands[9]) {
        msg.channel.send(calendar())
    } else if (command == commands[10] || command == commands[11]) {
        resend(client, msg, commandPrefix).then(newInput => {
            if (newInput == null) {
                msg.channel.send(new Discord.MessageEmbed().setTitle("No commands found").setDescription("none found within 100 messages"))
            } else {
                msg.channel.send(new Discord.MessageEmbed().setTitle("Resending command").setDescription(newInput))
                doCommand(client, newInput.toString(), msg)
            }
        })
    }
}

module.exports = doCommand