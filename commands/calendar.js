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
        relative = "<t:" + ((now + endsIn) / 1000) + ":R>"
        absolute = "<t:" + ((now + endsIn) / 1000) + ":F>"
    } else {
        type = "starts"
        relative = "<t:" + ((now + eventIn) / 1000) + ":R>"
        absolute = "<t:" + ((now + eventIn) / 1000) + ":F>"
    }
    name += event.name

    result += type + " " + relative + "\n" + absolute

    return {
        name: name,
        value: result
    } 
}

function when(event) {
    now = (new Date).getTime()
    
    nextEvent = event.anchor + (Math.floor((now - event.anchor) / event.interval) + 1) * event.interval
    eventIn = nextEvent - now

    if (eventIn > event.interval - event.duration) {
        farIn = (now - (nextEvent - event.interval))
        endsIn = event.duration - farIn
        
        return {
          time: endsIn,
          type: "endsIn",
        }
    } else {
        return {
          time: eventIn * 100,
          type: "eventIn",
        }
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
    eventsActive = 0
    events.forEach(event => {
        reply.push(calendarMessage(event))
        temp = when(event)
        sorts.push(temp.time)

        if (temp.type == "endIn") {
            eventsActive++
        }
    })

    title = "Calendar"
    if (eventsActive > 0) {
        title += "Event"
            if (eventsActive == 1) {
                title += "s"
            }
        
        title += " Active!"
    }
    return new Discord.MessageEmbed()
    .setColor(eventsActive > 1 ? "00FFFF" : "0000FF")
    .setTitle(title)
    .addFields(sort(reply, sorts))
}