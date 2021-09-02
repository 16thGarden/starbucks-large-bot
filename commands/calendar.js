const Discord = require('discord.js');

skyblockYear = 1000 * 60 * 60 * 124
oneHour = 1000 * 60 * 60
oneMinute = 1000 * 60

jerryWorkshopOpensAnchor = 1630323300000 - skyblockYear
jerryEventAnchor = jerryWorkshopOpensAnchor + (oneHour * 7 + oneMinute * 40) - skyblockYear
newYearCelebrationAnchor = jerryEventAnchor + (oneHour * 1 + oneMinute * 40) - skyblockYear
spookyFestivalAnchor = 1630654500000 - skyblockYear
spookyFishingAnchor = spookyFestivalAnchor - (oneHour) - skyblockYear
travellingZooAnchor = 1630248900000 - skyblockYear

events = [
    {
        name: "Jerry's Workshop Opens",
        anchor: jerryWorkshopOpensAnchor,
        duration: oneHour * 10 + oneMinute * 20,
        interval: oneHour * 124,
    },
    {
        name: "Jerry Event",
        anchor: jerryEventAnchor,
        duration: oneHour * 1,
        interval: oneHour * 124,
    },
    {
        name: "New Year Celebration",
        anchor: newYearCelebrationAnchor,
        duration: oneHour * 1,
        interval: oneHour * 124,
    },
    {
        name: "Spooky Festival",
        anchor: spookyFestivalAnchor,
        duration: oneHour * 1,
        interval: oneHour * 124,
    },
    {
        name: "Spooky Fishing",
        anchor: spookyFishingAnchor,
        duration: oneHour * 3,
        interval: oneHour * 124,
    },
    {
        name: "Travelling Zoo",
        anchor: travellingZooAnchor,
        duration: oneHour * 1,
        interval: oneHour * 62,
    }

]

function unixEpochToString(n) {
    dayLength = 1000 * 60 * 60 * 24
    hourLength = 1000 * 60 * 60
    minuteLength = 1000 * 60

    days = Math.floor(n / dayLength)
    n %= dayLength
    hours = Math.floor(n / hourLength)
    n %= hourLength
    minutes = Math.floor(n / minuteLength)
    n %= minuteLength
    return days + "d " + hours + "h " + minutes + "m"
}

function calendarMessage(event) {
    now = (new Date).getTime()
    nextEvent = event.anchor + (Math.floor((now - event.anchor) / event.interval) + 1) * event.interval
    eventIn = nextEvent - now

    dateFormat = "DDD MMM dd hh:mm:ss 12"

    name = ""
    result = ""
    var type, relative, absolute
    if (eventIn > event.interval - event.duration) {
        name += "Currently " 
        farIn = (now - (nextEvent - event.interval))
        endsIn = event.duration - farIn
        type = "ends"
        relative = "<t:" + ((now + endsIn) / 1000) + ":F>"
        absolute = "<t:" + ((now + endsIn) / 1000) + ":R>"
    } else {
        type = "starts"
        relative = "<t:" + ((now + eventIn) / 1000) + ":F>"
        absolute = "<t:" + ((now + eventIn) / 1000) + ":R>"
    }
    name += event.name

    result += type + " in " + relative + "\n" + absolute

    return {
        name: name,
        value: result
    } 
}

function when(event) {
    now = (new Date).getTime()
    nextEvent = event.anchor
    while(nextEvent <= now) {
        nextEvent += event.interval
    }

    eventIn = nextEvent - now

    if (eventIn > event.interval - event.duration) {
        farIn = (now - (nextEvent - event.interval))
        endsIn = event.duration - farIn
        
        return endsIn
    } else {
        return eventIn * 2
    }
}

function sort(reply, sorts) {
    for (var i = 0; i < sorts.length; i++) {
        for(var j = 0; j < sorts.length - i - 1; j++) {
            if(sorts[j] > sorts[j + 1]) {
                var temp = sorts[j]
                sorts[j] = sorts[j + 1]
                sorts[j+1] = temp

                temp = reply[j]
                reply[j] = reply[j + 1]
                reply[j+1] = temp
            }
        }
    }

    return reply
}

module.exports = function() {
    reply = []
    sorts = []
    events.forEach(event => {
        reply.push(calendarMessage(event))
        sorts.push(when(event))
    })

    return new Discord.MessageEmbed()
    .setColor("0000FF")
    .setTitle("Calendar")
    .addFields(sort(reply, sorts))
}