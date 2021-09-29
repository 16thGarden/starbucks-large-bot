const Discord = require('discord.js');
const fetch = require('node-fetch');

const ignToUuid = require('../../functions/ignToUuid.js')

const getWeight = (ign) => {
    if (ign === undefined) {
        replyTitle = "Missing Field(s)!"
        replyBody = "usage: s.weight <ign>"

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
                var data = json.profiles[Object.keys(json.profiles)[0]].data
                skillWeight = data.skillWeight
                slayerWeight = data.slayerWeight
                dungeonsWeight = data.dungeonsWeight
                totalWeight = data.weight
                
                reply = new Discord.MessageEmbed()
                .setTitle("Player " + result.name + " weight")
                .addFields([
                    {name: "Total Weight", value: totalWeight},
                    {name: "Breakdown", value: 
                        "Skill weight: " + skillWeight + "\n" +
                        "Slayer Weight: " + slayerWeight + "\n" +
                        "Dungeons Weight: " + dungeonsWeight
                    },
                ])

                resolve(reply)
            })
        })
    })
}

module.exports = async (ign) => {
    return await getWeight(ign)
}