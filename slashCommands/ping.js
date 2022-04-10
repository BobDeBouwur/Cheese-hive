const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Geeft de ping terug van de bot.'),
    async execute(client, Interaction) {

        Interaction.reply({ content: `Pong **${client.ws.ping}** ms`, ephemeral: true });

    }

}