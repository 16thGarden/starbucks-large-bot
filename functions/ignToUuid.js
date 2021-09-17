const fetch = require('node-fetch');

const ignToUuid = (ign) => {
    return new Promise((resolve, reject) => {
        fetch("https://api.mojang.com/users/profiles/minecraft/" + ign)
        .then(res => res.json())
        .then(json => {
            resolve(json)
        })
        .catch(error => {
            resolve({
                error: true
            })
        })
    })
}

module.exports = async (ign) => {
    return await ignToUuid(ign)
}