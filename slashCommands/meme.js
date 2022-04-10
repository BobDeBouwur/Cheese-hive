const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require("node-fetch");
const discord = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Geeft een meme.'),
    async execute(client, Interaction) {

        fetch("https://www.reddit.com/r/memes/random/.json").then(resp =>
            resp.json()).then(respData => {

                var permaLink = respData[0].data.children[0].data.permalink;
                var memeUrl = `https://www.reddit.com${permaLink}`;
                var memeFoto = respData[0].data.children[0].data.url;
                var memeTitle = respData[0].data.children[0].data.title;

                var embed = new discord.MessageEmbed()
                    .setTitle(`${memeTitle}`)
                    .setURL(`${memeUrl}`)
                    .setImage(`${memeFoto}`)
                    .setColor("RANDOM");

                    Interaction.reply({ embeds: [embed] });

            }).catch("ërror", (err) => {
                console.log("Er ging iets fout" + err.message);
            });

    }

}