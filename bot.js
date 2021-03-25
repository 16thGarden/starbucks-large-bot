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

var showIncommingMessages = false;

var curGuild = null;
var curChannel = null;
var curVoiceChannel = null;
var curVoiceChannelJoined = false;

var guildArr = [];
var channelArr = [];
var voiceChannelArr = [];

var incommingMessagesChannel = null;
var joinAndLeavesChannel = null;

var embed;

client.login(process.env.BOT_TOKEN).then(() => {
    client.guilds.cache.forEach((guild, index) => {
        if (guild.id != process.env.CONTROL_CENTER_ID) {
            guildArr.push(guild);
        }
    });
});

client.on('message', msg => {
    if (process.env.CONTROL_CENTER_ID == msg.guild.id && process.env.CONTROLLER_ID == msg.author.id) {
        var input = msg.content;
        if (input.charAt(0) == "!") {
            var command = input.split(" ");
            if (command[0] == "!help") {
                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Help",
                    value:'commands start with !\n!commands to show commands\n!channelsettings to show channel setting commands\ntype a message to send it to the current server and channel'
                });
            } else if (command[0] == "!commands") {
                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Commands",
                    value:
                    "!help                        - show help" + "\n" +
                    "!commands                    - show commands" + "\n" +
                    "!status (!s)                 - show current server and channels" + "\n" +
                    "!displayservers (!ds)        - show list of servers" + "\n" +
                    "!setserver <number> (!ss)    - set the server to send messages to" + "\n" +
                    "!displaychannels (!dc)       - show list of channels in current server" + "\n" +
                    "!setchannel <number> (!sc)   - set the channel to send messages to" + "\n" +
                    "!sendraw (!sr)               - if your message starts with \"!\"" + "\n" +
                    "!displayvoicechannels (!dvc) - show list of voice channels in current server" + "\n" +
                    "!setvoicechannel (!svc)      - leave any voice channel if any and set the voice channel to join" + "\n" +
                    "!leavevoicechannel (!lvc)    - leave current voice channel" + "\n" +
                    "!refresh (!r)                - refresh server list" + "\n" +
                    "!togglemessages (!tm)        - toggle display of incoming messages" + "\n" +
                    "!leave (!l)                  - leave current server" + "\n"
                });
            } else if (command[0] == "!channelsettings") {
                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Commands",
                    value:                    
                    "!setchannelJAL (!scjal)      - set this channel as the joins and leaves channel" + "\n" +
                    "!removeJAL (!rjal)          - reset joins and leaves channel" + "\n" +
                    "!setchannelM (!scm)   - set this channel to recieve the incomming messages" + "\n" +
                    "!removeM (!rm)   - reset recieve the incomming messages" + "\n"
                }); 
            } else if (command[0] == "!status" || command[0] == "!s") {
                var guildStatus, channelStatus, voiceChannelStatus; 
                if (curGuild == null) {
                    guildStatus = "[None]";
                } else {
                    guildStatus = curGuild.name;
                }

                if (curChannel == null) {
                    channelStatus = "[None]";
                } else {
                    channelStatus = curChannel.name;
                }
                if (curVoiceChannel == null) {
                    voiceChannelStatus = "[None]";
                } else {
                    voiceChannelStatus = curVoiceChannel.name;
                }
                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Status",
                    value: "Server: " + guildStatus + "\n" +
                    "Channel: " + channelStatus + "\n" +
                    "Voice Channel: " + voiceChannelStatus + " joined: " + curVoiceChannelJoined + "\n"
                });
            } else if (command[0] == "!displayservers" || command[0] == "!ds") {
                guildList = "";
                guildArr.forEach((guild, index) => {
                    guildList += (index + 1) + ": " + guild.name + " | " + guild.id + "\n";
                });

                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Display Servers",
                    value: guildList
                });
            } else if (command[0] == "!setserver" || command[0] == "!ss") {
                var response = "";
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
                            voiceChannelArr = [];
                            curGuild.channels.cache.forEach(channel => {
                                if (channel.type == 'voice') {
                                    voiceChannelArr.push(channel);
                                }
                            });

                            response = "Selected server: " + curGuild.name;
                        } else {
                            response = "Number out of range!";
                        }
                    } else {
                        response = "Not a number!";
                    }
                } else {
                    response = "Missing arguments!";
                }

                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Set Server",
                    value: response
                });
            } else if (command[0] == "!displaychannels" || command[0] == "!dc") {
                channelList = "";
                if (curGuild != null) {
                    channelArr.forEach((channel, index) => {
                        channelList += (index + 1) + ": " + channel.name + " | " + channel.id + "\n";
                    });
                } else {
                    channelList = "No Server Selected"
                }

                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Display Channel",
                    value: channelList
                });
            } else if (command[0] == "!setchannel" || command[0] == "!sc") {
                var response = "";

                if (curGuild != null) {
                    channelNumber = command[1];
                    if (channelNumber != null) {
                        if (!isNaN(channelNumber)) {
                            channelNumber = parseInt(channelNumber)
                            if (channelNumber > 0 && channelNumber <= channelArr.length) {
                                curChannel = channelArr[channelNumber - 1];
                                response = "Selected channel: " + curChannel.name;
                            } else {
                                response = "Number out of range!";
                            }
                        } else {
                            response = "Not a number!";
                        }
                    } else {
                        response = "Missing arguments!";
                    }
                } else {
                    response = "No Server Selected";
                }

                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Set Channel",
                    value: response 
                });
            } else if (command[0] == "!sendraw" || command[0] == "!sr") {
                response = "";

                text = command[1]
                if (text != null) {
                    if (curChannel != null) {
                        curChannel.send(text);
                        response = "Sent \"" + text + "\" to " + curGuild.name + " in channel " + curChannel.name;
                    } else {
                        response = "No Channel Set";
                    }
                } else {
                    response = "Missing Arguments!";
                }

                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Message Sending",
                    value: response
                });
            } else if (command[0] == "!displayvoicechannels" || command[0] == "!dvc") {
                voiceChannelList = "";
                if (curGuild != null) {
                    voiceChannelArr.forEach((channel, index) => {
                        voiceChannelList += (index + 1) + ": " + channel.name + " | " + channel.id + "\n";
                    });
                } else {
                    voiceChannelList = "No Server Selected"
                }

                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Voice Channels",
                    value: voiceChannelList 
                });
            } else if (command[0] == "!setvoicechannel" || command[0] == "!svc") {
                curVoiceChannelJoined = true;
                var response = "";

                if (curVoiceChannel != null) {
                    curVoiceChannel.leave();
                }

                channelNumber = command[1];
                if (channelNumber != null) {
                    if (!isNaN(channelNumber)) {
                        channelNumber = parseInt(channelNumber)
                        if (curGuild != null) {
                            if (channelNumber > 0 && channelNumber <= channelArr.length) {
                                curVoiceChannel = voiceChannelArr[channelNumber - 1];
                                client.channels.cache.get(curVoiceChannel.id).join();
                                response = "joined voice channel " + curVoiceChannel.name;
                            } else {
                                response = "Number out of range!";
                            }
                        } else {
                            response = "No Server Selected";
                        }
                    } else {
                        response = "Not a number!";
                    }
                } else {
                    response = "Missing arguments!";
                }

                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Set Voice Channel",
                    value: response
                });
            } else if (command[0] == "!leavevoicechannel" || command[0] == "!lvc") {
                curVoiceChannelJoined = false;
                curVoiceChannel.leave();
                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Leave Voice Channel",
                    value: "Left Voice Channel: " + curVoiceChannel.name
                });
            } else if (command[0] == "!leave" || command[0] == "!l") {
                var response = "";
                if (curGuild == null) {
                    response = "no server selected!";
                } else {
                    response = "Left: " + curGuild.name;
                    client.guilds.cache.get(curGuild.id).leave();
                }

                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Leave Server",
                    value: response
                });
            } else if (command[0] == "!channelstatus" || command[0] == "!cs") {
                var imStatus, jalStatus;
                if (incommingMessagesChannel == null) {
                    imStatus = "[None]"
                } else {
                    imStatus = incommingMessagesChannel.name;
                }

                if (joinAndLeavesChannel == null) {
                    jalStatus = "[None]";
                } else {
                    jalStatus = joinAndLeavesChannel.name;
                }
                
                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Channel Status",
                    value: "Messages Channel: " + imStatus + "\n" +
                    "Join and Leaves Channel: " + jalStatus + "\n"
                });
            } else if (command[0] == "!setchannelJAL" || command[0] == "!scjal") {
                joinAndLeavesChannel = msg.channel;
                
                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Channel Set",
                    value: "set this channel to show joins and leaves"
                });
            } else if (command[0] == "!removeJAL" || command[0] == "!rjal") {
                joinAndLeavesChannel = null;
                
                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Channel Set",
                    value: "reseted joins and leaves channel"
                });
            } else if (command[0] == "!setchannelM" || command[0] == "!scm") {
                incommingMessagesChannel = msg.channel;

                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Channel Set",
                    value: "set this channel to recieve messages"
                });
            } else if (command[0] == "!removeM" || command[0] == "!rm") {
                incommingMessagesChannel = null;

                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Channel Set",
                    value: "reseted recieve messageschannel"
                });
            } else {
                embed = new Discord.MessageEmbed()
                .setColor("White")
                .addFields({
                    name: "Error",
                    value:'Unknown Command'
                });
            }
        } else {
            response = "";

            text = msg.content;
            if (text != null) {
                if (curChannel != null) {
                    curChannel.send(text);
                    response = "Sent \"" + text + "\" to " + curGuild.name + " in channel " + curChannel.name;
                } else {
                    response = "No Channel Set";
                }
            }

            embed = new Discord.MessageEmbed()
            .setColor("White")
            .addFields({
                name: "Message Sending",
                value: response
            });
        }

        msg.channel.send(embed);
    }
});

client.on('message', msg => {
    if (msg.channel.guild.id != process.env.CONTROL_CENTER_ID) {
        if (incommingMessagesChannel != null) {
            embed = new Discord.MessageEmbed()
            .setColor("White")
            .addFields({
                title: "Message",
                name: "Server: " + msg.channel.guild.name + " Channel: " + msg.channel.name,
                value: msg.author.username + "#" + msg.author.discriminator + ": " + msg.content
            });

            incommingMessagesChannel.send(embed);
        }
    }
});

client.on("guildCreate", guild => {
    guildArr = [];
    client.guilds.cache.forEach((guild, index) => {
        if (guild.id != process.env.CONTROL_CENTER_ID) {
            guildArr.push(guild);
        }
    });
    var message = "Joined a new Server: " + guild.name;
    
    embed = new Discord.MessageEmbed()
    .setColor("White")
    .addFields({
        name: "Join",
        value: message
    });

    if (joinAndLeavesChannel != null) {
        joinAndLeavesChannel.send(embed);
    }
});

client.on("guildDelete", guild => {
    guildArr = [];
    client.guilds.cache.forEach((guild, index) => {
        if (guild.id != process.env.CONTROL_CENTER_ID) {
            guildArr.push(guild);
        }
    });
    var message = "Left a Server: " + guild.name;

    if (guild.id == curGuild.id) {
        curGuild = null;
        curChannel = null;
        curVoiceChannel = null;
    }
    
    embed = new Discord.MessageEmbed()
    .setColor("White")
    .addFields({
        name: "Leave",
        value: message
    });

    if (joinAndLeavesChannel != null) {
        joinAndLeavesChannel.send(embed);
    }
});