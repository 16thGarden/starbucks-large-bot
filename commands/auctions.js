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

                replyTitle = "Player " + ign + " Auctions"
                replyBody = []

                var milliseconds = (new Date).getTime();

                replyValue = ""
                bins.forEach(auction => {
                    var name = auction.item_name
                    if (name == "Enchanted Book") {
                        name = auction.item_lore.split("\n")[0].slice(2);
                    }

                    var cost = auction.starting_bid.toString().split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                    replyValue += name + " (" + cost + ") " + ": " + (auction.bids.length == 0 ? "not sold, " : "sold.")
                    if (auction.bids.length == 0 && milliseconds > auction.end) {
                        replyValue += "expired."
                    } else {
                        if (auction.bids.length == 0) {
                            timeLeft = auction.end - milliseconds

                            dayLength = 1000 * 60 * 60 * 24
                            hourLength = 1000 * 60 * 60
                            minuteLength = 1000 * 60

                            days = Math.floor(timeLeft / dayLength)
                            timeLeft %= dayLength
                            hours = Math.floor(timeLeft / hourLength)
                            timeLeft %= hourLength
                            minutes = Math.floor(timeLeft / minuteLength)
                            timeLeft %= minuteLength
                            replyValue += "ends in " + days + "d " + hours + "h " + minutes + "m."
                        }
                    }
                    replyValue += "\n"
                })
                if (bins.length != 0) {
                    replyBody.push({
                        name: "BIN:",
                        value: replyValue
                    })
                }

                replyValue = ""
                notbins.forEach(auction => {
                    var name = auction.item_name
                    if (name == "Enchanted Book") {
                        name = auction.item_lore.split("\n")[0].slice(2);
                    }

                    var cost = auction.highest_bid_amount.toString().split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                    replyValue += name + " (bid at " + cost + ") " + ": "
                    if (milliseconds >= auction.end) {
                        replyValue += "ended."
                    } else if (milliseconds < auction.end) {
                        timeLeft = auction.end - milliseconds

                        dayLength = 1000 * 60 * 60 * 24
                        hourLength = 1000 * 60 * 60
                        minuteLength = 1000 * 60

                        days = Math.floor(timeLeft / dayLength)
                        timeLeft %= dayLength
                        hours = Math.floor(timeLeft / hourLength)
                        timeLeft %= hourLength
                        minutes = Math.floor(timeLeft / minuteLength)
                        timeLeft %= minuteLength
                        replyValue += "ends in " + days + "d " + hours + "h " + minutes + "m."
                    }
                    replyValue += "\n"
                })
                if (notbins.length != 0) {
                    replyBody.push({
                        name: "AUCTIONS:",
                        value: replyValue
                    })
                }

                var noAuctions = false
                if (bins.length == 0 && notbins.length == 0) {
                    noAuctions = true
                    replyBody = "No active autions!"
                }

                if (noAuctions) {
                    reply = new Discord.MessageEmbed()
                    .setTitle(replyTitle)
                    .setDescription("No active autions!")
                } else {
                    reply = new Discord.MessageEmbed()
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