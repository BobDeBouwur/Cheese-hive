module.exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Sorry jij kan dit commando niet uitvoeren!");

    await message.channel.permissionOverwrites.set([

        {
            id: message.guild.roles.cache.find(r => r.name === "@everyone").id,
            deny: ["SEND_MESSAGES"]
        }

    ]);

    return message.channel.send("✅Kanaal is succesvol in lockdown gezet.");

}

module.exports.help = {
    name: "lockdown",
    category: "general",
    description: "blokkeert het kanaal",
    aliases: []
}