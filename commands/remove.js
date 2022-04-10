const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    const categoryID = "961313735316746251";

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Jij hebt geen permissies om dit commando uit te voeren.");

    if (message.channel.parentId !== categoryID) return message.reply("Oeps, dit is niet in een ticket kanaal.");

    if (!args[0]) return message.reply("Geen gebruiker getagd.");

    var removeUser = message.guild.members.cache.get(message.mentions.users.first().id || message.guild.members.cahce.get(args[0]).id);

    if (!removeUser) return message.reply("Kan de gebruiker niet vinden.");

    var embed = new discord.MessageEmbed()
        .setTitle("✅ Gebruiker succesvol verwijderd!")
        .setColor("RANDOM")
        .setTimestamp()
        .addField("Verwijderd persoon: ", `${removeUser}`, false)
        .addField("Persoon verwijderd door: ", message.author.username);

    message.channel.permissionOverwrites.edit(removeUser, {
        SEND_MESSAGES: false,
        CREATE_INSTANT_INVITE: false,
        READ_MESSAGE_HISTORY: false,
        ATTACH_FILES: false,
        ADD_REACTIONS: false,
        CONNECT: false,
        VIEW_CHANNEL: false
    });

    message.channel.send({ embeds: [embed] }).then(msg => {
        setTimeout(() => msg.delete(), 10000)
    });
}

module.exports.help = {
    name: "remove",
    category: "general",
    description: "verwijderd iemand toe aan een ticket",
    aliases: []
}