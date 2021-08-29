const Discord = require('discord.js');

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

function prettyDate(epoch, dateFormat){
	//TODO: add args validations here in future..
	var shortMonths = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
	var longMonths  = 'January_Febrary_March_April_May_June_July_August_September_Octeber_November_December'.split('_');
	
	var shortDays = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
	var longDays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
	
	var _df 	= dateFormat;
	
	// convert epoch date to date object
	var 	dt 	= new Date(epoch);
	
	var	date	= dt.getDate(),
		month	= dt.getMonth(),
		year	= dt.getFullYear(),
		day 	= dt.getDay(),
		
		hour	= dt.getHours(),
		mins	= dt.getMinutes(),
		secs	= dt.getSeconds();
	
	// year
	if (_df && _df.indexOf('yyyy') != -1) {
		_df = _df.replace('yyyy', year);
	}
	
	// day of week in long format e.g. Monday
	if (_df && _df.indexOf('DDDD') != -1) {
		_df = _df.replace('DDDD', longDays[day]);
	}
	
	// day of week in short format e.g. Mon
	if (_df && _df.indexOf('DDD') != -1) {
		_df = _df.replace('DDD', shortDays[day]);
	}
	
	// date of the month
	if (_df && _df.indexOf('dd') != -1) {
		_df = _df.replace('dd', date < 10 ? ('0' + date) : date);
	}
	
	// Month of the year in long format e.g. January
	if (_df && _df.indexOf('MMMM') != -1) {
		_df = _df.replace('MMMM', longMonths[month]);
	}
	
	// Month of the year in short format e.g. Jan
	if (_df && _df.indexOf('MMM') != -1) {
		_df = _df.replace('MMM', shortMonths[month]);
	}
	
	// Month of the year in numeric format e.g. 01
	if (_df && _df.indexOf('MM') != -1) {
		_df = _df.replace('MM', (month + 1) < 10 ? ('0' + (month + 1)) : (month + 1));
	}
	
	// hours
	if (_df && _df.indexOf('hh') != -1) {
        if (_df && _df.indexOf('12') != -1) {
            _df = _df.replace('12', hour >= 12 ? "pm" : "am");
            hour %= 12
        }
        _df = _df.replace('hh', hour < 10 ? ('0' + hour) : hour);
	}
	
	// minutes
	if (_df && _df.indexOf('mm') != -1) {
		_df = _df.replace('mm', mins < 10 ? ('0' + mins) : mins);
	}
	
	// seconds
	if (_df && _df.indexOf('ss') != -1) {
		_df = _df.replace('ss', secs < 10 ? ('0' + secs) : secs);
	}

    // 12h/24h format
    if (_df && _df.indexOf('24') != -1) {
		_df = _df.replace('24', "");
	}
	
	return _df;
}

function calendarMessage(event) {
    now = (new Date).getTime()
    nextEvent = event.anchor
    while(nextEvent <= now) {
        nextEvent += event.interval
    }

    eventIn = nextEvent - now

    dateFormat = "DDD MMM dd hh:mm:ss 12"

    name = ""
    result = ""
    if (eventIn > event.interval - event.duration) {
        name += "Currently " 
        endsIn = nextEvent - (now - (nextEvent - event.interval))
        result += "ends in " + unixEpochToString(endsIn) + "\n" + prettyDate(now + endsIn, dateFormat)
    } else {
        result += "starts in " + unixEpochToString(eventIn) + "\n" + prettyDate(now + eventIn, dateFormat)
    }
    name += event.name

    return {
        name: name,
        value: result
    }
}

module.exports = function(commands, commandDescriptions) {
    skyblockYear = 1000 * 60 * 60 * 124
    oneHour = 1000 * 60 * 60

    jerryWorkshopOpensAnchor = 1630319700000 - skyblockYear
    jerryEventAnchor = jerryWorkshopOpensAnchor + (oneHour * 8) - skyblockYear
    newYearCelebrationAnchor = jerryEventAnchor + (oneHour * 2 + 1000 * 60 * 20) - skyblockYear
    spookyFestivalAnchor = 1630654500000 - skyblockYear
    spookyFishingAnchor = spookyFestivalAnchor - (oneHour) - skyblockYear
    travellingZooAnchor = 1630248900000 - skyblockYear

    events = [
        {
            name: "Jerry's Workshop Opens",
            anchor: jerryWorkshopOpensAnchor,
            duration: oneHour * 10,
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

    reply = []
    events.forEach(event => {
        reply.push(calendarMessage(event))
    })

    return new Discord.MessageEmbed()
    .setTitle("Calendar")
    .addFields(reply);
}