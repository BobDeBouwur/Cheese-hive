const discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    const row = new discord.MessageActionRow().addComponents(

        new discord.MessageButton()
            .setCustomId("test")
            .setLabel("TEST")
            .setStyle("PRIMARY"),

        new discord.MessageButton()
            .setCustomId("grijs")
            .setLabel("grijs")
            .setStyle("SECONDARY"),

        new discord.MessageButton()
            .setCustomId("groen")
            .setLabel("groen")
            .setStyle("SUCCESS"),

        new discord.MessageButton()
            .setCustomId("rood")
            .setLabel("rood")
            .setStyle("DANGER"),

        new discord.MessageButton()
            .setLabel("link")
            .setStyle("LINK")
            .setURL("https://www.twitch.tv/cheese_belly")

    );

    const rowSecond = new discord.MessageActionRow().addComponents(

        new discord.MessageButton()
            .setCustomId("emoji")
            .setLabel("emoji")
            .setStyle("SUCCESS")
            .setEmoji("💥")

    );

    message.channel.send({ content: "Test bericht", components: [row, rowSecond] });

    // We maken een filter aan die nakijkt als het dezelfde gebruiker 
    // is die het bericht heeft aangemaakt.
    const filter = (interaction) => {
        if (interaction.user.id === message.author.id) return true;
        return interaction.reply("Jij kan dit niet gebruiken.");
    }

    // We maken een component collector aan die er voor zal zorgen dat we de knoppen kunnen opvangen.
    // We voegen de filter er aan toe en geven mee dat men enkel maar max één knop kan indrukken.
    const collector = message.channel.createMessageComponentCollector({
        filter,
        max: 1
    });

    // Als men een knop heeft ingdrukt zal dit worden opgeroepen.
    // Deze zal de CustomID ophalen van de knop en hier kan men deze dan
    // gaan vergelijken in eventueel een switch case om zo een desbtreffende actie te doen.
    collector.on("collect", (interactionButton) => {

        const id = interactionButton.customId;

        switch (id) {
            case "test":
                return interactionButton.reply("Dit is de test knop");
            case "grijs":
                return interactionButton.reply("Dit is de grijze knop");
            default:
                return interactionButton.reply("Deze knop heeft nog geen functie.");
        }
    });

}

module.exports.help = {
    name: "knop",
    category: "general",
    description: "knop",
    aliases: []
}