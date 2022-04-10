const fs = require("fs");
const discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Sorry jij kan dit commando niet uitvoeren");

    if (!args[0]) return message.reply("Je moet een gebruiker taggen!");

    if (!args[1]) return message.reply("Je moet een reden geven voor de warn!");

    var warnUser = message.guild.members.cache.get(message.mentions.users.first().id || message.guild.members.get(args[0]).id)

    var reason = args.slice(1).join(" ");

    if (!warnUser) return message.reply("Kan de gegeven gebruiker niet vinden!");

    if (warnUser.permissions.has("MANAGE_MESSAGES")) return message.reply("Sorry je kan deze gebruiker geen warn geven");

    const warns = JSON.parse(fs.readFileSync("./warnings.json", "UTF8"));

    if (!warns[warnUser.id]) warns[warnUser.id] = {
        warns: 0
    }

    warns[warnUser.id].warns++;

    var embed = new discord.MessageEmbed()
        .setColor("#ff0000")
        .setFooter(message.member.displayName, message.author.displayAvatarURL)
        .setTimestamp()
        .setDescription(`**Gewarnd:** ${warnUser.user.username} (${warnUser.id})
            **Warning door:** ${message.author}
            **Redenen: ** ${reason}`)
        .addField("Aantal warns", warns[warnUser.id].warns.toString());

    const channel = message.member.guild.channels.cache.get("958266726217314344");

    if (!channel) return;

    channel.send({ embeds: [embed] });

    if (warns[warnUser.id].warns == 3) {

        var mes = new discord.MessageEmbed()
            .setDescription("PAS OP " + warnUser.user.username)
            .setColor("#ee0000")
            .addField("Bericht", "Nog één warn en je hebt een ban!!");

        message.channel.send({ embeds: [mes] });

    } else if (warns[warnUser.id].warns == 4) {

        message.guild.members.ban(warnUser, { reason: reason });
        message.channel.send(`${warnUser} is verbannen door de bot wegens te veel warns`);

    }
    
    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
        if (err) console.log(err);
    });

}

module.exports.help = {
    name: "warn",
    category: "general",
    description: "waarschuwt een gebruiker",
    aliases: []
}