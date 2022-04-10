const discord = require('discord.js');

module.exports.run = async (bot, message, args) => {

    //  !review aantal bericht bericht bericht

    const amountStars = args[0];

    if (!amountStars || amountStars < 1 || amountStars > 5) return message.reply("Geef een aantal sterren op 1 t.e.m 5");

    const messageReview = args.splice(1, args.length).join(" ") || '**Geen bericht gegeven**';

    const reviewChannel = message.member.guild.channels.cache.get("958266726217314344");

    if (!reviewChannel) return message.reply("Kanaal niet gevonden");

    var stars = "";

    for (var i = 0; i < amountStars; i++) {

        stars += ":star: ";

    }

    message.delete();

    const review = new discord.MessageEmbed()
        .setTitle(`${message.author.username} heeft een review geschreven! 🎉`)
        .setColor("#00ff00")
        .setThumbnail("https://cdn.discordapp.com/attachments/644498618979713054/959835231991513088/logo.jpg")
        .addField("Sterren:", `${stars}`)
        .addField("Review:", `${messageReview}`);

    message.channel.send("✅Je hebt zojuist een review geschreven.");

    return reviewChannel.send({ embeds: [review] });

}

module.exports.help = {
    name: "review",
    category: "general",
    description: "hiermee geef je een review",
    aliases: []
}