const discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    const options = [
        {
            label: "Twitch notifications",
            value: "960584896034766848",
            emoji: "🟣",
            description: "Je krijgt de Twtich notifications role"
        }
    ];

    const row = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageSelectMenu()
                .setCustomId("roles")
                .setMinValues(0)
                .setMaxValues(1)
                .setPlaceholder("Selecteer een rol")
                .addOptions(options)
        );

    return message.channel.send({ content: "**Hier kan je een rol selecteren**", components: [row] });

}

module.exports.help = {
    name: "dropdown",
    category: "general",
    description: "geeft een dropdown",
    aliases: []
}