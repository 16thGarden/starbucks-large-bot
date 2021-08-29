const hypixelapi = "https://api.hypixel.net";
require('dotenv').config()

module.exports = (host, path, params) => {
    out = "";
    out += host;
    out += "/";
    out += path
    
    out += "?key=" + process.env.HYPIXEL_API_KEY

    if (params.length != 0) {
        out += "&";

        for (var i = 0; i < params.length; i++) {
            out += params[i][0];
            out += "=";
            out += params[i][1];
            if (i != params.length - 1) {
                out += "&";
            }
        }
    }

    return out;
}