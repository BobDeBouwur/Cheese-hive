const discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    const categoryID = "961313735316746251";

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Sorry jij kan dit commando niet uitvoeren");

    if (message.channel.parentId == categoryID) {

        message.channel.delete();

        var embedTicket = new discord.MessageEmbed()
            .setTitle("Ticket, " + message.channel.name)
            .setDescription("Het ticket is gemarkeerd als **Compleet**")
            .setFooter("Ticket gesloten");
        var ticketChannel = message.member.guild.channels.cache.find(channel => channel.name === "staff-logs");
        if (!ticketChannel) return message.reply("Kanaal bestaat niet");

        return ticketChannel.send({ embeds: [embedTicket] });

    } else {
        return message.channel.send("Dit commando kan alleen in een ticket kanaal worden uitgevoerd!");
    }

}

module.exports.help = {
    name: "close",
    category: "general",
    description: "Dit closed een ticket",
    aliases: []
}