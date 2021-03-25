const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config()

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const colorChanger = {
    reset: function() {
        console.log("\x1b[0m");
    },
    setCyan: function() {
        console.log("\x1b[36m");
    },
    setYellow: function() {
        console.log("\x1b[33m");
    },
    setRed: function() {
        console.log("\x1b[31m");
    },
    setGreen: function() {
        console.log("\x1b[32m");
    }
}

var showIncommingMessages = true;

client.login(process.env.BOT_TOKEN).then(() => {
    var curGuild = null;
    var curChannel = null;
    var prompt = ""; 

    var guildArr = [];
    client.guilds.cache.forEach((guild, index) => {
        guildArr.push(guild);
    });

    var channelArr = [];

    var waitForUserInput = function() {
        if (curGuild == null) {
            prompt = "No server set, use command !help for info";
        } else if (curChannel == null) {
            prompt = "Server set to " + curGuild.name + "\nNo channel set, use command !help for info";
        } else {
            prompt = "Sending to server " + curGuild.name + "\nin channel " + curChannel.name;
        }

        readline.question(prompt + "\n", input => {
            colorChanger.setCyan();
            console.log("\n---------------------");
            if (input.charAt(0) == "!") {
                var command = input.split(" ");

                colorChanger.setYellow();
                if (command[0] == "!help") {
                    console.log("commands start with !");
                    console.log("!commands to show commands");
                } else if (command == "!commands") {
                    console.log("!help                      - show help");
                    console.log("!commands                  - show commands");
                    console.log("!displayservers (!ds)      - show list of servers");
                    console.log("!setserver <number> (!ss)  - set the server to send messages to");
                    console.log("!displaychannels (!dc)     - show list of channels in current server");
                    console.log("!setchannel <number> (!sc) - set the channel to send messages to");
                    console.log("!sendraw (!sr)             - if your message starts with \"!\"");
                    console.log("!togglemessages (!tm)      - toggle display of incoming messages");
                    console.log("!exit (!e)                 - exit the application");
                } else if (command[0] == "!displayservers" || command[0] == "!ds") {
                    guildArr.forEach((guild, index) => {
                        console.log((index + 1) + ": " + guild.name + " | " + guild.id);
                    });
                } else if (command[0] == "!setserver" || command[0] == "!ss") {
                    serverNumber = command[1];
                    if (serverNumber != null) {
                        if (!isNaN(serverNumber)) {
                            serverNumber = parseInt(serverNumber)
                            if (serverNumber > 0 && serverNumber <= guildArr.length) {
                                curGuild = guildArr[serverNumber - 1];
                                channelArr = [];
                                curGuild.channels.cache.forEach(channel => {
                                    if (channel.type == 'text') {
                                        channelArr.push(channel);
                                    }
                                });

                                console.log("Selected server: " + curGuild.name);
                            } else {
                                console.log("Number out of range!");
                            }
                        } else {
                            console.log("Not a number!");
                        }
                    } else {
                        console.log("Missing arguments!");
                    }
                } else if (command[0] == "!displaychannels" || command[0] == "!dc") {
                    channelArr.forEach((channel, index) => {
                        console.log((index + 1) + ": " + channel.name + " | " + channel.id);
                    });
                } else if (command[0] == "!setchannel" || command[0] == "!sc") {
                    channelNumber = command[1];
                    if (channelNumber != null) {
                        if (!isNaN(channelNumber)) {
                            channelNumber = parseInt(channelNumber)
                            if (channelNumber > 0 && channelNumber <= channelArr.length) {
                                curChannel = channelArr[channelNumber - 1];
                                console.log("Selected channel: " + curGuild.name);
                            } else {
                                console.log("Number out of range!");
                            }
                        } else {
                            console.log("Not a number!");
                        }
                    } else {
                        console.log("Missing arguments!");
                    }
                } else if (command[0] == "!sendraw" || command[0] == "!sr") {
                    text = command[1]
                    if (text != null) {
                        client.channels.cache.get(curChannel.id).send(text);
                        console.log("Sent \"" + input + "\" to " + curGuild.name + " in channel " + curChannel.name);
                    }
                } else if (command[0] == "!togglemessages" || command[0] == "!tm") {
                    showIncommingMessages = !showIncommingMessages;
                    console.log("show messages: " + showIncommingMessages);
                } else if (command[0] == "!exit" || command[0] == "!e") {
                    process.exit(0);
                } else {
                    console.log("Unknown command");
                }
            } else {
                colorChanger.setYellow();
                if (curGuild == null || curChannel == null) {
                    console.log("No Server or Channel set to send a message to!");
                } else {
                    client.channels.cache.get(curChannel.id).send(input);
                    console.log("Sent \"" + input + "\" to " + curGuild.name + " in channel " + curChannel.name);
                }
            }

            colorChanger.setCyan();
            console.log("---------------------\n");
            colorChanger.reset();

            waitForUserInput(); 
        });
    }
    waitForUserInput();
});

client.on('message', msg => {
    if (showIncommingMessages) {
        colorChanger.setRed();
        console.log("---------------------");
        colorChanger.setGreen();
        console.log("Server: \x1b[33m" + msg.channel.guild.name + "\x1b[32m Channel: \x1b[33m" + msg.channel.name);
        colorChanger.setCyan();
        console.log(msg.author.username + "#" + msg.author.discriminator + ": " + msg.content);
        colorChanger.setRed();
        console.log("---------------------\n");
        colorChanger.reset();
    }
});