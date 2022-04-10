const fs = require("fs");

module.exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Jij kan dit commando niet uitvoeren.");

    if (!args[0]) return message.reply("Je moet een scheldwoord meegevenb");

    var word = args[0].toLowerCase();

    var swearWordsJson = fs.readFileSync("./Data/SwearWords.json", "utf-8");
    var swearWords = JSON.parse(swearWordsJson);

    swearWords.push(word);

    swearWordsJson = JSON.stringify(swearWords);
    fs.writeFileSync("./Data/SwearWords.json", swearWordsJson, "utf-8");

    return message.channel.send("✅ Scheldwoord is succesvol toegevoegd!");

}

module.exports.help = {
    name: "addswearword",
    category: "general",
    description: "zegt hallooo",
    aliases: []
}