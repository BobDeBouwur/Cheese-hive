const { Client, Intents, Collection, Interaction, MessageEmbed } = require("discord.js");
const botConfig = require("./botConfig.json");
const fs = require("fs");
const internal = require("stream");
const mongoose = require("mongoose");
require("dotenv").config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const tempMute = JSON.parse(fs.readFileSync("./tempMutes.json", "utf8"));
const { SlashCommandBuilder } = require('@discordjs/builders');
const SwearWords = require("./Data/SwearWords.json");
const levelFile = require("./Data/levels.json");
const { setTimeout } = require("timers/promises");
const { InteractionType } = require("discord-api-types/v10");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES]
});

client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();
const slashCommands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(command.help.name, command);

    command.help.aliases.forEach(alias => {
        client.aliases.set(alias, command.help.name);
    })

    console.log(`De file ${command.help.name}.js is geladen`);

}

const commandSlashFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith(".js"));

for (const fileSlash of commandSlashFiles) {

    const commandSlash = require(`./slashCommands/${fileSlash}`);

    client.slashCommands.set(commandSlash.data.name, commandSlash);
    slashCommands.push(commandSlash.data.toJSON());

    console.log(`De file ${commandSlash.data.name}.js is geladen`);

}

client.once("ready", async () => {
    console.log(`${client.user.username} is online. `);
    client.user.setActivity("🟣Twitch.tv/Cheese_belly", { type: "WATCHING" });

    await mongoose.connect(
        process.env.MONGO_URI,
        {
            keepAlive: true
        }
    );

    const statusOptions = [
        "🟣 Twitch.tv/Cheese_belly",
        "© Cheese_belly 2022"
    ]

    let counter = 0;

    let time = 30 * 1000; // 30 seconde

    const updateStatus = () => {
        client.user.setPresence({

            status: "online",
            activities: [
                {
                    name: statusOptions[counter],
                    type: "WATCHING"
                }
            ]
        });

        if (++counter >= statusOptions.length) counter = 0;

        setTimeout(updateStatus, time);

    }
    updateStatus();

    const checkTempMute = async () => {

        // Omdat we over object propertys gaan moeten we dit anders doen dan een array.
        // We gaan hier over iedere key in het object gaan in het tempMutes.json bestand.
        for (const result of Object.keys(tempMute)) {
            // We halen het ID er uit.
            const idMember = result;
            // We halen de tijd op vanuit het hele bestand bij die key (ID) en dan de tijd.
            const time = tempMute[result].time;

            // Tijd van nu ophalen.
            let date = new Date();
            let dateMilli = date.getTime();
            // Tijd bij gebruiker omvormen naar leesbare tijd.
            let dateReset = new Date(time);

            // Als de tijd van het muten kleiner is als de tijd van nu en de tijd staat niet op 0
            // dan mag deze persoon verlost worden van het zwijgen.
            if (dateReset < dateMilli && time != 0) {

                try {
                    // We halen de server op.
                    let guild = await client.guilds.fetch("957386580216152164");
                    // We gaan de persoon gegevens ophalen aan de hand van de idMember waar we de tekens < @ ! > weghalen.
                    const mutePerson = guild.members.cache.find(member => member.id === idMember.replace(/[<@!>]/g, ''));
                    // We halen de rol op.
                    let muteRole = guild.roles.cache.get('961337610842800178');
                    // We kijken na als de rol bestaat.
                    if (!muteRole) return console.log("De rol muted bestaat niet.");
                    // We verwijderen de rol van de persoon.
                    await (mutePerson.roles.remove(muteRole.id));
                    // We zetten de tijd op 0.
                    tempMute[mutePerson].time = 0;
                    // We slaan dit mee op in het document.
                    fs.writeFile("./tempMutes.json", JSON.stringify(tempMute), (err) => {
                        if (err) console.log(err);
                    });
                }
                catch (err) {
                    console.log(err + " Persoon kon niet geunmute worden wegens deze persoon niet meer op de server is");
                }
            }
        }
        setTimeout(checkTempMute, 1000 * 60); // We zetten een timeout van 1 minuut.
    }
    checkTempMute(); // We starten de functie met de timeout.


    let guildId = "957386580216152164";
    let clientId = "959818543631847437";

    const rest = new REST({ version: '9' }).setToken(botConfig.token);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: slashCommands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();



    // const guild = client.guilds.cache.get("957386580216152164");

    // let commands;

    // if (guild) {
    //     commands = guild.commands;
    // } else {
    //     commands = client.application.commands;
    // }

    // commands.create({
    //     name: "ping",
    //     description: "Geeft pong als bericht terug."
    // });

    // commands.create({
    //     name: "argument",
    //     description: "Twee getallen optellen.",
    //     options: [
    //         {
    //             name: "nummer1",
    //             description: "Het eerste nummer",
    //             type: 10,
    //             require: true
    //         },
    //         {
    //             name: "nummer2",
    //             description: "Het tweede nummer",
    //             type: 10,
    //             require: true
    //         }
    //     ]
    // });


});

client.on("interactionCreate", async Interaction => {

    if (Interaction.isSelectMenu()) {
        const { customId, values, member } = Interaction;

        if (customId === 'roles') {

            const components = Interaction.component;

            const removed = components.options.filter((option) => {
                return !values.includes(option.value)
            });

            for (var id of removed) {
                member.roles.remove(id.value)
            }

            for (var id of values) {
                member.roles.add(id)
            }

            Interaction.reply({
                content: "Rollen geupdate!",
                ephemeral: true
            });

        }
    } else if (Interaction.isCommand()) {

        const slashCommand = client.slashCommands.get(Interaction.commandName);
        if (!slashCommand) return;

        try {

            await slashCommand.execute(client, Interaction);

        } catch (err) {
            await Interaction.reply({ content: "Er was een probleem tijdens het uitvoeren van dit commando", ephemeral: true });
        }


        // const { commandName, options } = Interaction;

        // if (commandName === 'ping') {
        //     Interaction.reply({
        //         content: "pong",
        //         ephemeral: false
        //     })
        // } else if (commandName === 'argument') {

        //     const num1 = options.getNumber("nummer1");
        //     const num2 = options.getNumber("nummer2");

        //     Interaction.reply({
        //         content: `${num1 + num2}`,
        //         ephemeral: false
        //     })
        // }

    } else {
        return
    }




})

// client.on("interactionCreate", async (Interaction) => {

//     if (Interaction.isButton()) {
//         if (Interaction.customId === "test") {
//             Interaction.reply("Je hebt op de test gekliikt");
//         } else {
//             Interaction.reply("fout");
//         }
//     }

// });

client.on("guildMemberAdd", async (member) => {

    var role = member.guild.roles.cache.get("957386580216152165");

    if (!role) return;

    member.roles.add(role);

    var channel = member.guild.channels.cache.get("957386580757188805");

    if (!channel) return;

    channel.send(`Welkom op de server, ${member}`);

    // Omdat we over object propertys gaan moeten we dit anders doen dan een array.
    for (const result of Object.keys(tempMute)) {
        // Voor meer uitleg zie vorig stuk.
        const idMember = result;
        const time = tempMute[result].time;

        // We kijken na als het de persoon is die op de server is gekomen.
        if (idMember.replace(/[<@!>]/g, '') == member.id) {

            let date = new Date();
            let dateMilli = date.getTime();
            let dateReset = new Date(time);

            let muteRole = member.guild.roles.cache.get('961337610842800178');

            if (!muteRole) return message.channel.send("De rol muted bestaat niet");

            try {
                // Als de tijd van de mute nog groter is dan de tijd van nu moet die de rol terug krijgen.
                if (dateReset > dateMilli) {
                    await (member.roles.add(muteRole.id));
                } else if (time != 0) {
                    // Anders mag de rol weg maar omdat deze opnieuw aanmeld is deze al weg en gaan we enkel
                    // de tijd op nul zetten zodat we niet nog eens moeten opslaan.
                    let guild = await client.guilds.fetch("957386580216152164");
                    const mutePerson = guild.members.cache.find(member => member.id === idMember.replace(/[<@!>]/g, ''));
                    tempMute[mutePerson].time = 0;

                    fs.writeFile("./tempMutes.json", JSON.stringify(tempMute), (err) => {
                        if (err) console.log(err);
                    });
                }
            } catch (err) {
                console.log(err + " Iets liep mis met de rollen toevoegen/verwijderen.");
            }
        }
    }

});

client.on("messageCreate", async message => {

    if (message.author.bot) return;

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    if (!message.content.startsWith(prefix)) {

        RandomXP(message);

        var msg = message.content.toLowerCase();

        for (let index = 0; index < SwearWords.length; index++) {
            const swearWord = SwearWords[index];

            if (msg.includes(swearWord.toLowerCase())) {

                message.delete();
                return await message.channel.send("Je mag niet schelden.").then(msg => {

                    setTimeout(() => {
                        msg.delete()
                    }, 3000);

                });

            }

        }

    }
    else {
        const commandData = client.commands.get(command.slice(prefix.length)) || client.commands.get(client.aliases.get(command.slice(prefix.length)));

        if (!commandData) return;

        var arguments = messageArray.slice(1);

        try {

            await commandData.run(client, message, arguments);

        } catch (error) {
            console.log(error);
            await message.reply("Er was een probleem tijdens het uitvoeren van deze command");
        }
    }
});

function RandomXP(message) {

    var randomXP = Math.floor(Math.random() * 15) + 1;

    console.log(randomXP);

    var idUser = message.author.id;

    if (!levelFile[idUser]) {

        levelFile[idUser] = {
            xp: 0,
            level: 0
        }

    }

    levelFile[idUser].xp += randomXP;

    var levelUser = levelFile[idUser].level;
    var xpUser = levelFile[idUser].xp;
    var nextlevelXp = levelUser * 300;

    if (nextlevelXp == 0) nextlevelXp = 100;

    if (xpUser >= nextlevelXp) {

        levelFile[idUser].level += 1;

        fs.writeFile("./Data/levels.json", JSON.stringify(levelFile),
            err => {
                if (err) return console.log("Er ging iets fout bij het uitvoeren van hget commando");
            });

        if (levelFile[idUser].level == 5) {
            var role = message.guild.roles.cache.find(r => r.name === "plakje kaas 5+");

            var member = message.member;
            member.roles.add(role);

            var embedLevel = new MessageEmbed()
                .setDescription("***Nieuwe rang & level hoger***")
                .setColor("#00ff00")
                .addField("Nieuwe rang: ", "plakje kaas")
                .addField("Nieuw level: ", levelFile[idUser].level.toString());
            message.channel.send({ embeds: [embedLevel] });

        } else {
            var embedLevel = new MessageEmbed()
                .setDescription("***Level hoger***")
                .setColor("#00ff00")
                .addField("Nieuw level: ", levelFile[idUser].level.toString());
            message.channel.send({ embeds: [embedLevel] });
        }

    }

}

client.login(process.env.token);