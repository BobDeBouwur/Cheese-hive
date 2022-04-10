const botConfig = require("../botConfig.json");

module.exports.run = async (client, message, args) => {

    try {

        var prefix = botConfig.prefix;

        var response = "**Bot Commands**\r\n\n";
        var general = "**__Algemeen__**\r\n";
        var info = "\n**__Informatie__**\r\n";

        client.commands.forEach(command => {

            switch (command.help.category) {

                case "general":
                    general += `${prefix}${command.help.name} - ${command.help.description}\r\n`;
                    break;
                case "info":
                    info += `${prefix}${command.help.name} - ${command.help.description}\r\n`;
                    break;
            }

        });

        response += general + info;

        message.author.send(response).then(() => {
            return message.reply("Alle commands kan je vinden in je prive berichten!");
        }).catch(() => {
            return message.reply("Je prive berichten zijn uitgeschakeld je hebt dus geen bericht ontvangen");
        })

    } catch (error) {
        message.reply("Er was een probleem tijdens het uitvoeren van deze command");
    }
}

module.exports.help = {
    name: "help",
    category: "info",
    description: "geeft dit menu",
    aliases: []
}