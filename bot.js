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

    if (msg.channel.type == "dm") {
        if (msg.author.id != process.env.CONTROLLER_ID) {
            msg.channel.send("don't be a pussy and send your command in the public chat");
            return
        }
    }

    input = msg.content;
    if (input.startsWith("s.")) {
        input = input.slice(2);
        input = input.split(" ");

        replyTitle = "";
        replyBody = "";
        if (input[0] == "help") {
            replyTitle = "available commands:"
            replyBody = "online, auctions, secrets"
            
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

                reply = new Discord.MessageEmbed()
                .addFields({
                    name: replyTitle,
                    value: replyBody
                });
                msg.channel.send(reply);
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
                replyTitle = "invalid arguments!"
                replyBody = "usage: s.auctions <ign>"
                
                reply = new Discord.MessageEmbed()
                .addFields({
                    name: replyTitle,
                    value: replyBody
                });
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
                        replyTitle += "Player " + input[1] + " auctions:\n"

                        var milliseconds = (new Date).getTime();

                        if (bins.length != 0) {
                            replyBody += "BIN:\n"
                        }
                        bins.forEach(auction => {
                            var name = auction.item_name
                            if (name == "Enchanted Book") {
                                name = auction.item_lore.split("\n")[0].slice(2);
                            }

                            var cost = auction.starting_bid.split(".")[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                            replyBody += name + " (" + cost + ") " + ": " + (auction.bids.length == 0 ? "not sold" : "sold")
                            replyBody += (auction.bids.length == 0 && milliseconds > auction.end ? ", expired" : "") + "\n"
                        })

                        if (notbins.length != 0) {
                            replyBody += "AUCTIONS:\n"
                        }
                        notbins.forEach(auction => {
                            var name = auction.item_name
                            if (name == "Enchanted Book") {
                                name = auction.item_lore.split("\n")[0].slice(2);
                            }

                            var cost = auction.highest_bid_amount.split(".")[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                            replyBody += name + " (bid at " + cost + ") " + ": " + (milliseconds > auction.end ? "ended" : "not ended") + "\n"
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
        } else if (input[0] == "secrets") {
            if (input.length < 2) {
                replyTitle = "invalid arguments!"
                replyBody = "usage: s.secrets <ign>"
                
                reply = new Discord.MessageEmbed()
                .addFields({
                    name: replyTitle,
                    value: replyBody
                });
                msg.channel.send(reply);
            } else {
                fetch('https://sky.shiiyu.moe/api/v2/profile/' + input[1])
                .then(res => res.json())
                .then(json => {                    
                    secrets = json.profiles[Object.keys(json.profiles)[0]].data.dungeons.secrets_found;

                    replyTitle = input[1] + " Secret Count";
                    replyBody = "found secrets: " + secrets;

                    reply = new Discord.MessageEmbed()
                    .addFields({
                        name: replyTitle,
                        value: replyBody
                    });
                    msg.channel.send(reply)
                }).catch((error) => {
                    replyTitle = "Player not Found!";
                    replyBody = "Player " + input[1] + "was not found!";

                    reply = new Discord.MessageEmbed()
                    .addFields({
                        name: replyTitle,
                        value: replyBody
                    });
                    msg.channel.send(reply)
                });
            }
        } else if (input[0] == "flist") {
            if (input.length < 2) {
                replyTitle = "invalid arguments!";
                replyBody = "usage: s.flist <ign> <page (optional)>"

                reply = new Discord.MessageEmbed()
                .addFields({
                    name: replyTitle,
                    value: replyBody
                });
                msg.channel.send(reply);
            } else {
                var page = input[2] || 1;
                page--;
                var perPage = 5;
                
                var failed = false;

                fetch(buildPath("https://minecraft-api.com", "api/uuid/" + input[1] + "/json", []))
                .then(res => res.json())
                .then(json => {
                    fetch(buildPath(hypixelapi, "friends", [["uuid", json.uuid]]))
                    .then(res => res.json())
                    .then(json => {
                        var ownuuid = json.uuid;
                        var fuuidlist = []
                        
                        var lastPage = Math.ceil(json.records.length / perPage) - 1
                        var lastPageSize = json.records.length % perPage
                        
                        var starting = page * perPage;
                        var limit = (page == lastPage ? page * perPage + lastPageSize : page * perPage + perPage)

                        for (var i = starting; i < limit; i++) {
                            if (json.records[i].uuidSender == ownuuid) {
                                fuuidlist.push(json.records[i].uuidReceiver)
                            } else {
                                fuuidlist.push(json.records[i].uuidSender)
                            }
                        }
                        
                        var statuses = []
                        fuuidlist.forEach((uuid, i, array) => {
                            fetch(buildPath(hypixelapi, "status", [["uuid", uuid]]))
                            .then(res => res.json())
                            .then(json => {
                                if (!json.success) {
                                    failed = true;
                                }
                                statuses.push(json.session.online)

                                if (i == array.length - 1) {
                                    if (failed || fuuidlist.length != statuses.length || fuuidlist.length != names.length) {
                                        reply = new Discord.MessageEmbed()
                                        .addFields({
                                            name: "API limit reached",
                                            value: "please try again after cooldown"
                                        });
                                        msg.channel.send(reply);
                                    } else {
                                        var names = []
                                        fuuidlist.forEach((uuid, i, array) => {
                                            fetch(buildPath("https://minecraft-api.com", "api/pseudo/" + uuid + "/json", []))
                                            .then(res => res.json())
                                            .then(json => {
                                                names.push(json.pseudo);

                                                if (i == array.length - 1) {
                                                    replyTitle = "Friends List Page " + (page + 1) + " of " + (lastPage + 1);
                                                    names.forEach((name, i, array) => {
                                                        replyBody += name + ": " + (statuses[i] ? "online" : "offline") + "\n";
                                                    });

                                                    reply = new Discord.MessageEmbed()
                                                    .addFields({
                                                        name: replyTitle,
                                                        value: replyBody
                                                    });
                                                    msg.channel.send(reply);
                                                }
                                            });
                                        });
                                    }
                                }
                            });
                        })
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