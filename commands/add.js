const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    const categoryID = "961313735316746251";

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Jij hebt geen permissies om dit commando uit te voeren.");

    if (message.channel.parentId !== categoryID) return message.reply("Oeps, dit is niet in een ticket kanaal.");

    if (!args[0]) return message.reply("Geen gebruiker getagd.");

    var addUser = message.guild.members.cache.get(message.mentions.users.first().id || message.guild.members.cahce.get(args[0]).id);

    if (!addUser) return message.reply("Kan de gebruiker niet vinden.");

    var embed = new discord.MessageEmbed()
        .setTitle("✅ Gebruiker succesvol toegevoegd!")
        .setColor("RANDOM")
        .setTimestamp()
        .addField("Toegevoegd persoon: ", `${addUser}`, false)
        .addField("Persson toegevoegd door: ", message.author.username);

    message.channel.permissionOverwrites.edit(addUser, {
        SEND_MESSAGES: true,
        CREATE_INSTANT_INVITE: false,
        READ_MESSAGE_HISTORY: true,
        ATTACH_FILES: true,
        ADD_REACTIONS: true,
        CONNECT: true,
        VIEW_CHANNEL: true
    });

    message.channel.send({ embeds: [embed] }).then(msg => {
        setTimeout(() => msg.delete(), 10000)
    });
}

module.exports.help = {
    name: "add",
    category: "general",
    description: "voegt iemand toe aan een ticket",
    aliases: []
}