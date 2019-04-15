const Discord = require('discord.js');
const client = new Discord.Client(),
    Enmap = require('enmap'),
    fs = require('fs');
let prefix = "!";

client.config = require('./config.js');
client.commands = new Enmap();

client.fortnitedb = new Enmap({name: 'fortnitedb'});
client.autoCheck = new Enmap({name: 'autoCheck'});

const init = async () => {
    fs.readdir('./events/', (err,files) => {
        if (err) return console.log(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            const event = require(`./events/${file}`);
            const eventName = file.split('.')[0];
            client.on(eventName, event.bind(null, client));
            delete require.cache[require.resolve(`./events/${file}`)];
        });
    });
    fs.readdir('./commands/', (err, files) => {
        if (err) return console.log(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            const props = require(`./commands/${file}`);
            const commandName = file.split('.')[0];
            console.log(`Loading command: ${commandName}`);
            client.commands.set(commandName, props);
        });
    });
};
init();

client.on('message', message => {
        if(message.content === "!infofortnite") {
            var fun_embed = new Discord.RichEmbed()
            .setColor('RANDOM')
            .setTitle(`<:Fortnite:518772145099374605> Commande en rapport avec Fortnite !`)
            .addField("**``!news``**", ":globe_with_meridians: Toutes les Actualité Fornite : https://www.epicgames.com/fortnite/fr/news")
            .addField("**``!twitterfr``**", ":calling: Twitter Fornite France : https://twitter.com/FortniteFR")
            .addField("**``!spawn``**", ":hotel: Te donne un Spawn aléatoire sur le Carte")
            .addField("**``!map``**", ":mountain_snow: Affiche la Map Fortnite")
            .addField("**``!sftn``**", "📈 Voir les Commandes pour les Stats Fortnite")
            .setTimestamp()
            message.channel.send(fun_embed);
            console.log('Commande Fortnite');
            client.channels.get("540107675397128202").send("Log / Utilisateur **" + message.author.username + "** / Commande **Fortnite**");
        }
        if(message.content === prefix + "map") {
            var info_embed = new Discord.RichEmbed()
            .setColor("#fd0071")
            .setTitle(":triangular_flag_on_post: Voici la map actuelle Fortnite")
            .setImage('https://cdn.discordapp.com/attachments/516014468086628352/552154178865070091/Fortnite_MapComplete_Saison8.jpg')
            message.channel.sendMessage(info_embed);
            console.log('Commande Map');
            client.channels.get("540107675397128202").send("Log / Utilisateur **" + message.author.username + "** / Commande **Map**");
        }
        if(message.content === "!sftn") {
            var fun_embed = new Discord.RichEmbed()
            .setColor('RANDOM')
            .setTitle(`:metal: Commande Stats Fortnite`)
            .setDescription(":point_right: Pour voir ces Stats Fortnite : !ftn pc/psn/xbl {pseudo} \n :point_right: Pour voir juste ces Stats Fortnite SOLO : !solo pc/psn/xbl {pseudo} \n :point_right: Pour voir juste ces Stats Fortnite DUO : !duo pc/psn/xbl {pseudo} \n :point_right: Pour voir juste ces Stats Fortnite SQUAD : !squad pc/psn/xbl {pseudo}")
            .setTimestamp()
            message.channel.send(fun_embed);
            console.log('Commande Fun');
            client.channels.get("540107675397128202").send("Log / Utilisateur **" + message.author.username + "** / Commande **Stats Fortnite**");
        }
        if(message.content === "!twitterfr") {
            message.channel.sendMessage(':calling: Twitter Fornite France : https://twitter.com/FortniteFR');
            client.channels.get("540107675397128202").send("Log / Utilisateur **" + message.author.username + "** / Commande **Twitter Fortnite France**");
        }
        if(!message.guild) return;
        let args = message.content.trim().split(/ +/g)
        if (args[0].toLocaleLowerCase()=== prefix + "spawn") {
            let rep = ["Loot Lake", "Lazy Lagoon", "Sunny Steps", "Lonely Lodge", "Shifty Shafts", "Haunted Hills", "Junk Junction", "Snobby Shores", "Frosty Flights", "Happy Hamlet", "Dusty Divot", "Polar Peak", "The Block", "Fatal Field", "Retail Row", "Lucky Landing", "Salty Spring", "Tilted Tower", "Pleasent Parck"];
            let reptaille = Math.floor((Math.random()* rep.length));
        
        let embed = new Discord.RichEmbed()
            .setTitle(":checkered_flag: Tu dois drop là bas !")
            .setColor("#0092ff")
            .setDescription("➔ " + rep[reptaille]);
        message.reply(embed);
    client.channels.get("540107675397128202").send("Log / Utilisateur **" + message.author.username + "** / Commande **Spawn**");
    }
    if(message.content === "!news") {
            message.channel.sendMessage(':globe_with_meridians: Toutes les Actualité Fornite : https://www.epicgames.com/fortnite/fr/news');
            client.channels.get("540107675397128202").send("Log / Utilisateur **" + message.author.username + "** / Commande **News Fortnite**");
    }
});

client.login(process.env.token);
