const testSchema = require("../test-schema");

module.exports.run = async (client, message, args) => {

    await new testSchema({
        bericht: "Dit is een test vanuit hallo."
    }).save();

    return message.channel.send("hallloooooo");

}

module.exports.help = {
    name: "hallo",
    category: "general",
    description: "zegt hallooo",
    aliases: []
}