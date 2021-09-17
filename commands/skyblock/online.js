const Discord = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config()

const ignToUuid = require('../../functions/ignToUuid.js')
const buildPath = require('../../functions/buildHypixelPath.js')

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
        ignToUuid(ign).then(result => {
            if (result.error) {
                replyTitle = "Player not Found!";
                replyBody = "Player " + ign + " was not found!";

                reply = new Discord.MessageEmbed()
                .setTitle(replyTitle)
                .setDescription(replyBody);

                resolve(reply)
            }

            fetch(buildPath("/status", [["uuid", result.id]]))
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

                                replyBody = [{name: "OFFLINE", value: "last seen <t:" + Math.floor(lastSeen / 1000) + ":R>"}]
                            }
                        });
                    }
                    
                    color = online ? "00FF00" : "FF0000"

                    reply = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(replyTitle)
                    .addFields(replyBody)

                    resolve(reply)
                })
            })
        })
    })
}

module.exports = async (ign) => {
    return await getStatus(ign)
}