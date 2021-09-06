const Discord = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config()

const buildPath = require('../buildHypixelPath.js')
const hypixelapi = "https://api.hypixel.net"

const getAuctions = (ign) => {
    if (ign === undefined) {
        replyTitle = "Missing Field(s)!"
        replyBody = "usage: s.auctions <ign>"

        reply = new Discord.MessageEmbed()
        .setTitle(replyTitle)
        .setDescription(replyBody)

        return new Promise((resolve, reject) => {
            resolve(reply)
        })
    }

    return new Promise((resolve, reject) => {
        fetch(buildPath("https://minecraft-api.com", "api/uuid/" + ign + "/json", []))
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

                replyTitle = "Player " + ign + " Auctions"
                replyBody = []
                unclaimedCoins = 0

                var milliseconds = (new Date).getTime();

                replyValueBIN = ""
                bins.forEach(auction => {
                    var name = auction.item_name
                    if (name == "Enchanted Book") {
                        name = auction.item_lore.split("\n")[0].replace(/\u00A7[0-9A-FK-OR]/ig,'');
                    }

                    var cost = auction.starting_bid.toString().split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                    replyValueBIN += name + " (" + cost + ") " + ": " + (auction.bids.length == 0 ? "not sold, " : "sold.")
                    if (auction.bids.length == 0 && milliseconds > auction.end) {
                        replyValueBIN += "expired."
                    } else {
                        if (auction.bids.length == 0) {
                            replyValueBIN += "ends" + "<t:" + (auction.end / 1000) + ":R>"
                        }
                    }
                    replyValueBIN += "\n"

                    if (auction.bids.length != 0) {
                        unclaimedCoins += auction.starting_bid
                    }
                })

                replyValueAUCTIONS = ""
                notbins.forEach(auction => {
                    var name = auction.item_name
                    if (name == "Enchanted Book") {
                        name = auction.item_lore.split("\n")[0].replace(/\u00A7[0-9A-FK-OR]/ig,'');
                    }

                    var cost = auction.highest_bid_amount.toString().split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                    replyValueAUCTIONS += name + " (bid at " + cost + ") " + ": "
                    if (milliseconds >= auction.end) {
                        replyValueAUCTIONS += "ended."
                    } else if (milliseconds < auction.end) {
                        replyValueAUCTIONS += "ends" + "<t:" + (auction.end / 1000) + ":R>"
                    }
                    replyValueAUCTIONS += "\n"

                    if (milliseconds >= auction.end && auction.highest_bid_amount > 0) {
                        unclaimedCoins += auction.highest_bid_amount
                    }
                })

                if (unclaimedCoins > 0) {
                    replyBody.push({
                        name: "You have unclaimed coins!",
                        value: "Total: " + unclaimedCoins.toString().split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    })
                }

                if (bins.length != 0) {
                    replyBody.push({
                        name: "BIN:",
                        value: replyValueBIN
                    })
                }

                if (notbins.length != 0) {
                    replyBody.push({
                        name: "AUCTIONS:",
                        value: replyValueAUCTIONS
                    })
                }

                var noAuctions = false
                if (bins.length == 0 && notbins.length == 0) {
                    noAuctions = true
                    replyBody = "No active autions!"
                }

                color = unclaimedCoins > 0 ? "FFFF00" : "000000"

                if (noAuctions) {
                    reply = new Discord.MessageEmbed()
                    .setTitle(replyTitle)
                    .setDescription("No active autions!")
                } else {
                    reply = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(replyTitle)
                    .addFields(replyBody)
                }
                
                resolve(reply)
            })
        })
        .catch((error) => {
            console.log(error)
            replyTitle = "Player not Found!";
            replyBody = "Player " + ign + " was not found!";

            reply = new Discord.MessageEmbed()
            .setTitle(replyTitle)
            .setDescription(replyBody)

            resolve(reply)
        })
    })
}

module.exports = async (ign) => {
    return await getAuctions(ign)
}