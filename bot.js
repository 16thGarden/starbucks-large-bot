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

const fetch = require('node-fetch');
const hypixelapi = "https://api.hypixel.net";
function buildPath(host, path, params) {
    out = "";
    out += host;
    out += "/";
    out += path
    
    out += "?key=" + process.env.HYPIXEL_API_KEY

    if (params.length != 0) {
        out += "&";

        for (var i = 0; i < params.length; i++) {
            out += params[i][0];
            out += "=";
            out += params[i][1];
            if (i != params.length - 1) {
                out += "&";
            }
        }
    }

    return out;
}

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('bot ready');
});

client.on('message', msg => {
    if (msg.author.bot) return

    input = msg.content;
    if (input.startsWith("s.")) {
        input = input.slice(2);
        input = input.split(" ");

        replyTitle = "";
        replyBody = "";
        if (input[0] == "help") {
            replyTitle = "available commands:"
            replyBody = "online, auctions"
            
            reply = new Discord.MessageEmbed()
            .addFields({
                name: replyTitle,
                value: replyBody
            });
            msg.channel.send(reply);
        } else if (input[0] == "online") {
            if (input.length < 2) {
                replyTitle = "invalid arguments!";
                replyBody = "usage: s.online <ign>"
            } else {
                fetch(buildPath("https://minecraft-api.com", "api/uuid/" + input[1] + "/json", []))
                .then(res => res.json())
                .then(json => {
                    fetch(buildPath(hypixelapi, "status", [["uuid", json.uuid]]))
                    .then(res => res.json())
                    .then(json => {
                        replyTitle = "Player " + input[1] + " Status";

                        if (json.session.online) {
                            replyBody = "currently online playing " + json.session.gameType;
                        } else {
                            replyBody = "currently offline"; 
                        }

                        reply = new Discord.MessageEmbed()
                        .addFields({
                            name: replyTitle,
                            value: replyBody
                        });
                        msg.channel.send(reply);
                    });
                })
                .catch((error) => {
                    replyTitle = "Player not Found!";
                    replyBody = "Player " + input[1] + "was not found!";

                    reply = new Discord.MessageEmbed()
                    .addFields({
                        name: replyTitle,
                        value: replyBody
                    });
                    msg.channel.send(reply);
                })
            }
        } else if (input[0] == "auctions") {
            if (input.length < 2) {
                reply = "invalid arguments!\nusage: s.auctions <ign>";
            } else {
                fetch(buildPath("https://minecraft-api.com", "api/uuid/" + input[1] + "/json", []))
                .then(res => res.json())
                .then(json => {
                    fetch(buildPath(hypixelapi, "skyblock/auction", [["player", json.uuid]]))
                    .then(res => res.json())
                    .then(json => {
                        bins = []
                        notbins = []
                        json.auctions.forEach(auction => {
                            if (auction.bin && auction.claimed == false) {
                                bins.push(auction)
                            } else if (!auction.bin && auction.claimed == false) {
                                notbins.push(auction)
                            }
                        });
                        replyTitle += "Player " + input[1] + " auctions:\n"

                        if (bins.length != 0) {
                            replyBody += "BIN:\n"
                        }
                        bins.forEach(auction => {
                            replyBody += auction.item_name + " (" + auction.starting_bid + ") " + ": " + (auction.bids.length == 0 ? "not sold" : "sold") + "\n"
                        })
                        var milliseconds
                        if (notbins.length != 0) {
                            replyBody += "AUCTIONS:\n"
                            milliseconds = (new Date).getTime();
                        }
                        notbins.forEach(auction => {
                            replyBody += auction.item_name + " (bid at " + auction.highest_bid_amount + ") " + ": " + (milliseconds > auction.end ? "ended" : "not ended") + "\n"
                        })

                        if (bins.length == 0 && notbins.length == 0) {
                            replyBody += "No active autions!"
                        }

                        reply = new Discord.MessageEmbed()
                        .addFields({
                            name: replyTitle,
                            value: replyBody
                        });
                        msg.channel.send(reply)
                    });
                })
                .catch((error) => {
                    replyTitle = "Player not Found!";
                    replyBody = "Player " + input[1] + "was not found!";

                    reply = new Discord.MessageEmbed()
                    .addFields({
                        name: replyTitle,
                        value: replyBody
                    });
                    msg.channel.send(reply)
                })
            }
        } else {
            replyTitle = "Unknown Command";
            replyBody = "type s.help for help";

            reply = new Discord.MessageEmbed()
            .addFields({
                name: replyTitle,
                value: replyBody
            });
            msg.channel.send(reply)
        }
    }

    
});

client.login(process.env.BOT_TOKEN).then(() => {
    console.log("connected!");
});