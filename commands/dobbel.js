module.exports.run = async (bot, message, args) => {

    var number = Math.ceil(Math.random() * 6);

    return message.channel.send(`🎲 Je hebt **${number}** gegooid.`);

}

module.exports.help = {
    name: "dobbel",
    category: "general",
    description: "gooit een dobbelsteen",
    aliases: ["steen", "dobbelsteen"]
}