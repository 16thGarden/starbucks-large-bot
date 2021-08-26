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

        reply = ""
        if (input[0] == "help") {
            msg.channel.send("available commands:\nonline\nauctions")
        } else if (input[0] == "online") {
            if (input.length < 2) {
                reply = "invalid arguments!\nusage: s.online <ign>";
                msg.channel.send(reply);
            } else {
                fetch(buildPath("https://minecraft-api.com", "api/uuid/" + input[1] + "/json", []))
                .then(res => res.json())
                .then(json => {
                    fetch(buildPath(hypixelapi, "status", [["uuid", json.uuid]]))
                    .then(res => res.json())
                    .then(json => {
                        if (json.session.online) {
                            reply = "Player " + input[1] + " is currently online playing " + json.session.gameType;
                        } else {
                            reply = "Player " + input[1] + " is currently offline"; 
                        }

                        msg.channel.send(reply);
                    });
                })
                .catch((error) => {
                    msg.channel.send("Player " + input[1] + " not found!");
                })
            }
        } else if (input[0] == "auctions") {
            if (input.length < 2) {
                reply = "invalid arguments!\nusage: s.auctions <ign>";
                msg.channel.send(reply);
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
                        reply += "Player " + input[1] + " auctions:\n"

                        if (bins.length != 0) {
                            reply += "BIN:\n"
                        }
                        bins.forEach(auction => {
                            reply += auction.item_name + " (" + auction.starting_bid + ") " + ": " + (auction.bids.length == 0 ? "not sold" : "sold") + "\n"
                        })
                        var milliseconds
                        if (notbins.length != 0) {
                            reply += "AUCTIONS:\n"
                            milliseconds = (new Date).getTime();
                        }
                        notbins.forEach(auction => {
                            reply += auction.item_name + " (bid at " + auction.highest_bid_amount + ") " + ": " + (milliseconds > auction.end ? "ended" : "not ended") + "\n"
                        })

                        if (bins.length == 0 && notbins.length == 0) {
                            reply = "No active autions!"
                        }

                        msg.channel.send(reply);
                    });
                })
                .catch((error) => {
                    msg.channel.send("Player " + input[1] + " not found!");
                })
            }
        } else {
            msg.channel.send("unknown command, type s.help for help")
        }
    }

    
});

client.login(process.env.BOT_TOKEN).then(() => {
    console.log("connected!");
});