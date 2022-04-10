module.exports.run = async (client, message, args) => {

    if (!args[0]) return message.reply("Gebruik sps <steen, papier, schaar>");

    var options = ["steen", "papier", "schaar"];

    var result = options[Math.floor(Math.random() * options.length)];

    switch (args[0].toUpperCase()) {

        case "STEEN":

            switch (result) {
                case "steen":
                    message.channel.send(`Ik heb ${result} 🧱, Het is gelijjkspel.`);
                    break;

                case "papier":
                    message.channel.send(`Ik heb ${result} 📒, Ik win.`);
                    break;

                case "schaar":
                    message.channel.send(`Ik heb ${result} ✂, Jij wint.`);
                    break;
            }
            break;

        case "PAPIER":

            switch (result) {
                case "steen":
                    message.channel.send(`Ik heb ${result} 🧱, Jij wint.`);
                    break;

                case "papier":
                    message.channel.send(`Ik heb ${result} 📒, Het is gelijjkspel.`);
                    break;

                case "schaar":
                    message.channel.send(`Ik heb ${result} ✂, Ik win.`);
                    break;
            }
            break;

        case "SCHAAR":

            switch (result) {
                case "steen":
                    message.channel.send(`Ik heb ${result} 🧱, Ik win.`);
                    break;

                case "papier":
                    message.channel.send(`Ik heb ${result} 📒, Jij wint.`);
                    break;

                case "schaar":
                    message.channel.send(`Ik heb ${result} ✂, Het is gelijjkspel.`);
                    break;
            }
            break;

        default:

            return message.channel.send("Gebruik steen, papier of schaar");

    }

}

module.exports.help = {
    name: "sps",
    category: "general",
    description: "speel steen, papier, schaar",
    aliases: []
}