const Discord = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config()

const ignToUuid = require('../../functions/ignToUuid.js')

const getSecrets = (ign) => {
    if (ign === undefined) {
        replyTitle = "Missing Field(s)!"
        replyBody = "usage: s.secrets <ign>"

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
                .setDescription(replyBody)

                resolve(reply)
            }
            
            fetch('https://sky.shiiyu.moe/api/v2/profile/' + ign)
            .then(res => res.json())
            .then(json => {                    
                secrets = json.profiles[Object.keys(json.profiles)[0]].data.dungeons.secrets_found;

                clown = secrets < 1000
                replyTitle = ign + " "
                replyTitle += clown ? ":clown:" : ""
                replyTitle +=  " Secret Count"
                replyBody = "found secrets: " + secrets.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                reply = new Discord.MessageEmbed()
                .setTitle(replyTitle)
                .setDescription(replyBody)

                resolve(reply)
            }).catch((error) => {
                console.log(error)
                replyTitle = "Player not Found!";
                replyBody = "Player " + result.name + " was not found!";

                reply = new Discord.MessageEmbed()
                .setTitle(replyTitle)
                .setDescription(replyBody)

                resolve(reply)
            });
        }).catch()
    })
}

module.exports = async (ign) => {
    return await getSecrets(ign)
}