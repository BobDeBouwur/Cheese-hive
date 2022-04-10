const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    var botEmbed = new discord.MessageEmbed()
        .setTitle("Een titel")
        .setDescription("Een beschrijving")
        .setColor("DARK_AQUA")
        .addFields(
            { name: "Bot naam", value: client.user.username },
            { name: "Je bent de server gejoined op", value: message.member.joinedAt.toString() },
            { name: "Totaal members", value: message.guild.memberCount.toString() }
        );

    return message.channel.send({ embeds: [botEmbed] });

}

module.exports.help = {
    name: "serverinfo",
    category: "info",
    description: "geeft server info",
    aliases: []
}