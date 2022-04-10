const discord = require('discord.js');

module.exports.run = async (client, message, args) => {

    const roodColor = message.guild.roles.cache.find(role => role.name === 'Twitch notifications');
    const groenColor = message.guild.roles.cache.find(role => role.name === 'mod');

    const row = new discord.MessageActionRow().addComponents(
        new discord.MessageButton()
            .setCustomId("Twitch notifications")
            .setLabel("Twitch rol")
            .setStyle("DANGER"),

        new discord.MessageButton()
            .setCustomId("mod")
            .setLabel("mod rol")
            .setStyle("SUCCESS")
    );

    message.channel.send({ content: "Kies een role", components: [row] });

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
    collector.on("collect", async (interactionButton) => {

        const id = interactionButton.customId;
        const userID = interactionButton.user.id;
        var bericht = "";

        switch (id) {
            case "Twitch notifications":

                await interactionButton.guild.members.cache.get(userID).roles.cache.has(roodColor.id)
                    ? await interactionButton.guild.members.cache.get(userID).roles.remove(roodColor).then(() => {
                        bericht = "Je **Twitch Notifications** role is weg gehaald";
                    })
                    : await interactionButton.guild.members.cache.get(userID).roles.add(roodColor).then(() => {
                        bericht = "Je hebt de **Twitch notifications** role gekregen";
                    });

                return interactionButton.reply(bericht);
            case "mod":
                await interactionButton.guild.members.cache.get(userID).roles.cache.has(groenColor.id)
                    ? await interactionButton.guild.members.cache.get(userID).roles.remove(groenColor).then(() => {
                        bericht = "Je **mod** role is weg gehaald";
                    })
                    : await interactionButton.guild.members.cache.get(userID).roles.add(groenColor).then(() => {
                        bericht = "Je hebt de **mod** role gekregen";
                    });

                return interactionButton.reply(bericht);
            default:
                return interactionButton.reply("Deze knop heeft nog geen functionaliteit.");
        }
    });

}

module.exports.help = {
    name: "reactionrole",
    category: "general",
    description: "je krijgt een reactie role",
    aliases: []
}