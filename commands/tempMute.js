const ms = require("ms");

const fs = require("fs");
const tempMute = JSON.parse(fs.readFileSync("./tempMutes.json", "utf8"));

module.exports.run = async (bot, message, args) => {

    // tempmute gebruiker tijd(h,m,s)

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Sorry jij kan dit commando niet uitvoeren");

    if (!args[0]) return message.reply("Je moet een gebruiker taggen!");

    var mutePerson = message.guild.members.cache.get(message.mentions.users.first().id || message.guild.members.get(args[0]).id);

    if (!mutePerson) return message.reply("Kan de gegeven gebruiker niet vinden!");

    if (mutePerson.permissions.has("MANAGE_MESSAGES")) return message.reply("Sorry je kan deze gebruiker geen mute geven");

    let muteRole = message.guild.roles.cache.get("961337610842800178");

    if (!muteRole) return message.channel.send("De rol Muted bestaat niet");

    var muteTime = args[1];

    if (!muteTime) return message.channel.send("Geeft een tijd mee in de mute! dit kan in uur, minuten en in seconde zijn.");

    if (mutePerson.roles.cache.some(role => role.name === "Muted")) {
        message.channel.send("Deze persoon is al gemute.");
    } else {
        mutePerson.roles.add(muteRole.id);
        message.channel.send(`${mutePerson} is gemute voor ${muteTime}`);

        if (!tempMute[mutePerson]) tempMute[mutePerson] = {
            time: 0
        };

        let date = new Date();
        let dateMilli = date.getTime();
        let dateAdded = dateMilli + ms(muteTime);

        tempMute[mutePerson].time = dateAdded;

        fs.writeFile("./tempMutes.json", JSON.stringify(tempMute), (err) => {
            if (err) console.log(err);
        });

        // setTimeout(() => {

        //     mutePerson.roles.remove(muteRole.id);

        // }, ms(muteTime));
    }

}

module.exports.help = {
    name: "tempmute",
    category: "general",
    description: "Hiermee kan je iemand een mute geven",
    aliases: []
}