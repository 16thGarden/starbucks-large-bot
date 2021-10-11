
const getLastCommand = (client, msg, commandPrefix) => {
    return new Promise((resolve, reject) => {
        channel = client.channels.cache.get(msg.channel.id)
        channel.messages.fetch({ limit: 100 }).then(messages => {
            messages.forEach(message => {
                command = message.content.toLowerCase()
                if (!command.startsWith("s.r") && !command.startsWith("s.resend")) {
                    if (command.startsWith(commandPrefix)) {
                        resolve({
                            originalMessage: message,
                            command: command
                        })
                    }
                }
            })
        })
    })
}

module.exports = async (client, msg, commandPrefix) => {
    return await getLastCommand(client, msg, commandPrefix)
}