const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    var botEmbed = new discord.MessageEmbed()
        .setTitle("Een titel")
        .setDescription("Een beschrijving")
        .setColor("DARK_AQUA")
        .addField("Bot naam", client.user.username)
        .setThumbnail('https://cdn.discordapp.com/attachments/644498618979713054/959835231991513088/logo.jpg')
        .setImage('https://cdn.discordapp.com/attachments/644498618979713054/959835231991513088/logo.jpg')
        .setTimestamp()
        .setFooter("Footer tekst", 'https://cdn.discordapp.com/attachments/644498618979713054/959835231991513088/logo.jpg');

    return message.channel.send({ embeds: [botEmbed] });

}

module.exports.help = {
    name: "info",
    category: "info",
    description: "geeft info",
    aliases: []
}