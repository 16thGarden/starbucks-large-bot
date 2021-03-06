require('dotenv').config()

// keep app awake module
const wakeUpDyno = require('./functions/keepAwake.js')

const express = require("express");
const exphandle = require("express-handlebars")
const path = require("path")
const port = process.env.PORT || 5000;
const dynoUrl = process.env.DYNO_URL;
const app = express();

app.engine("hbs", exphandle({
    extname: "hbs",
    defaultView: "main",
    layoutsDir: path.join(__dirname, "/views/layouts"), // Layouts folder
    partialsDir: path.join(__dirname, "/views/partials"), // Partials folder
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
}))
app.set("view engine", "hbs")
app.use(express.static("public"))

app.listen(port, function() {
    wakeUpDyno(dynoUrl);
});

app.get("/", function(req, res) {
    res.render("home", {
        invite_url: "https://discord.com/oauth2/authorize?client_id=824468040745615401&scope=bot"
    });
})

//===================================================================

const Discord = require('discord.js');
const client = new Discord.Client();
const whitelist = require('./whitelist.js')
const doCommand = require('./doCommand.js')
const log = require('./functions/log.js')

isWhiteListed = (id) => {
    for (var i = 0; i < whitelist.length; i++) {
        if (id == whitelist[i]) {
            return true
        }
    }

    return false
}

client.on('ready', () => {
    console.log('bot ready');
    client.user.setActivity("(s.help)");
});

client.on('message', msg => {
    if (msg.author.bot) return
    input = msg.content;
    if (!input.toLowerCase().startsWith(commandPrefix)) return
    if (msg.channel.type == "dm") {
        if (!isWhiteListed(msg.author.id)) {
            //msg.channel.send("dm commands not available");
            return
        }
    }

    log(client, msg)
    doCommand(client, input, msg)
});

client.login(process.env.BOT_TOKEN).then(() => {
    console.log("connected!");
});