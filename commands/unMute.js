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

    if (!mutePerson.roles.cache.some(role => role.name === "Muted")) {
        message.channel.send("Deze persoon is al geunmute.");
    } else {
        mutePerson.roles.remove(muteRole.id);
        message.channel.send(`${mutePerson} is geunmute`);

        tempMute[mutePerson].time = 0;

        fs.writeFile("./tempMutes.json", JSON.stringify(tempMute), (err) => {
            if (err) console.log(err);
        });
    }

}

module.exports.help = {
    name: "unmute",
    category: "general",
    description: "Hiermee kan je iemand een unmutemute geven",
    aliases: []
}