const Discord = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config()
const KEY = process.env.HYPIXEL_API_KEY

const getStatus = (ign) => {
    if (ign === undefined) {
        replyTitle = "Missing Field(s)!"
        replyBody = "usage: s.online <ign>"

        reply = new Discord.MessageEmbed()
        .setTitle(replyTitle)
        .setDescription(replyBody)

        return new Promise((resolve, reject) => {
            resolve(reply)
        })
    }

    return new Promise((resolve, reject) => {
        fetch("https://minecraft-api.com/api/uuid/" + ign + "/json")
        .then(res => res.json())
        .then(json => {
            fetch("https://api.hypixel.net/status?key=" + KEY + "&uuid=" + json.uuid)
            .then(res => res.json())
            .then(json => {
                online = json.session.online
                gametype = json.session.gameType
                fetch("https://sky.shiiyu.moe/api/v2/profile/" + ign)
                .then(res => res.json())
                .then(json => {
                    replyTitle = "Player " + ign + " Status";

                    if (online) {
                        replyBody = [{name: "ONLINE", value: "playing " + gametype}]
                    } else {
                        Object.keys(json.profiles).map(function(objectKey, index) {
                            var profile = json.profiles[objectKey];
                            
                            if (profile.current) {
                                cur_profile = profile.profile_id

                                now = (new Date).getTime()
                                lastSeen = json.profiles[cur_profile].last_save

                                ago = now - lastSeen
                                
                                dayLength = 1000 * 60 * 60 * 24
                                hourLength = 1000 * 60 * 60
                                minuteLength = 1000 * 60

                                days = Math.floor(ago / dayLength)
                                ago %= dayLength
                                hours = Math.floor(ago / hourLength)
                                ago %= hourLength
                                minutes = Math.floor(ago / minuteLength)
                                ago %= minuteLength
                                agoString = days + "d " + hours + "h " + minutes + "m ago"


                                replyBody = [{name: "OFFLINE", value: "last seen " + agoString}]
                            }
                        });
                    }
                    
                    reply = new Discord.MessageEmbed()
                    .setTitle(replyTitle)
                    .addFields(replyBody)

                    resolve(reply)
                })
            });
        })
        .catch((error) => {
            replyTitle = "Player not Found!";
            replyBody = "Player " + ign + " was not found!";

            reply = new Discord.MessageEmbed()
            .setTitle(replyTitle)
            .setDescription(replyBody);

            resolve(reply)
        })
    })
}

module.exports = async (ign) => {
    return await getStatus(ign)
}