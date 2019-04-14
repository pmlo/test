const Discord = require('discord.js');
const fn = require('fortnite');
const Canvas = require('canvas');

exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
    const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
        let fontSize = 60;
        do {
            ctx.font = `${fontSize -= 10}px sans-serif`;
        } while (ctx.measureText(text).width > canvas.width - 300);
        return ctx.font;
    };
    const fortnite = new fn(client.config.fnkey);
  
    let platform;
    let query;
    const platforms = ['xbox', 'xb1', 'xbox1', 'xbox one', 'xbl', 'playstation', 'ps4', 'ps', 'playstation 4', 'psn', 'computer', 'pc'];
    if (!args[0]) {
        const fndb = client.fortnitedb.get(message.author.id);
        if (!fndb) return message.reply('<:No:566681468420489248> Erreur ! Compte Fortnite non lié à une discorde ou à une utilisation incorrecte');
        const fields = fndb.split(':');
        platform = fields[0];
        query = fields[1];
    } else if (message.mentions.users.first()) {
        const fndb = client.fortnitedb.get(message.mentions.users.first().id);
        if (!fndb) return message.reply('<:No:566681468420489248> Erreur ! Compte Fortnite non lié à une discorde ou à une utilisation incorrecte');
        const fields = fndb.split(':');
        platform = fields[0];
        query = fields[1];
    } else if (platforms.indexOf(args[0]) !== -1) {
        platform = args[0];
        query = args.splice(1, args.length).join(' ');
    } else {
        platform = 'pc';
        query = args.splice(0, args.length).join(' ');
    }
  
    if (!query || !platform) return message.reply("<:No:566681468420489248> Erreur! L'utilisation correcte est fortnite [platform] [username]");
    try {
        var res = await fortnite.user(query, platform);
  
        if (res) {
            const result = await res;
            const duo = result.stats.duo;
            const lifetime = result.stats.lifetime;

            const statz = {
                top5: lifetime[0]['Top 5s'],
                top12: lifetime[4]['Top 12s'],
            };

            let plat;
            switch (result.platform) {
                case 'PlayStation 4':
                    plat = 'PS4';
                    break;
                case 'Xbox One':
                    plat = 'Xbox';
                    break;
                case 'PC':
                default:
                    plat = 'PC';
            }

            if (result) {
                switch (message.flags[0]) {
                    case 'old':
                    case 'embed':
                    case 'v1': {
                        const embed = new Discord.RichEmbed()
                            .setColor(message.guild ? message.guild.me.displayHexColor : '#35c7e4')
                            .setTitle(`Fortnite Duo Stats for ${result.username} on ${result.platform}`)
                            .setURL(result.url)
                            .setFooter('a France De Fortnite')
                            .setThumbnail('https://pbs.twimg.com/profile_images/991264373086871553/q3bnn-BT.jpg')
                            .addField('Matches Played', duo.matches, true)
                            .addField('Wins', duo.wins, true)
                            .addField('Kills', `${duo.kills} (K/D:${duo.kd})`,true)
                            .addField('Score', `${duo.score} (${duo.score_per_match} per game)`,true)
                            .addField('Top 5 Placements', statz.top5,true)
                            .addField('Top 12 Placements', statz.top12,true);
                        message.channel.send({embed});
                    }
                        break;
                    case 'new':
                    case 'v2':
                    default: {
                        const canvas = Canvas.createCanvas(700, 500);
                        const ctx = canvas.getContext('2d');

                        const background = await Canvas.loadImage('./assets/wallpaper.png');
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                        ctx.font = '80px sans-serif';
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText('Duo', canvas.width / 2.5, 100);

                        const ree = `${result.username} - ${plat}`;
                        ctx.font = applyText(canvas, ree);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(ree, canvas.width / 2.5, 200);

                        ctx.font = '28px sans-serif';
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText('Matches,', 20, 280);

                        ctx.font = applyText(canvas, duo.matches);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(duo.matches, 20, 348);

                        ctx.font = '28px sans-serif';
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText('Wins,', 200, 280);

                        ctx.font = applyText(canvas, duo.wins);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(duo.wins, 200, 348);

                        ctx.font = '28px sans-serif';
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText('Kills,', 370, 280);

                        ctx.font = applyText(canvas, duo.kills);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(duo.kills, 370, 348);

                        ctx.font = '28px sans-serif';
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText('K/D,', 520, 280);

                        ctx.font = applyText(canvas, duo.kd);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(duo.kd, 520, 348);

                        ctx.font = '28px sans-serif';
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText('Score,', 20, 410);

                        ctx.font = applyText(canvas, duo.score);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(duo.score, 20, 478);

                        ctx.font = '28px sans-serif';
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText('Top 5,', 370, 410);

                        ctx.font = applyText(canvas, statz.top10);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(statz.top5, 370, 478);

                        ctx.font = '28px sans-serif';
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText('Top 12,', 520, 410);

                        ctx.font = applyText(canvas, statz.top25);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(statz.top12, 520, 478);

                        const logo = await Canvas.loadImage('./assets/fn-logo.jpg');
                        ctx.drawImage(logo, 25, 25, 200, 200);

                        const attachment = new Discord.Attachment(canvas.toBuffer(), './ree.png');
                        // message.channel.send(attachment);
                        const embed = new Discord.RichEmbed()
                            .setColor(message.guild.me.displayHexColor ? message.guild.me.displayHexColor : '#35c7e4')
                            .attachFile(attachment)
                            .setImage('attachment://ree.png');
                        message.channel.send({embed});
                    }
                } 
            }
        }
    } catch (err) {
        message.channel.send("<:No:566681468420489248> Une erreur s'est produite! Pardon!");
        return console.log(err);
    }
};

exports.help = {
    name: 'duo',
    description: 'Fetches duo stats for a user from The Fortnite Tracker',
    usage: 'duo (Platform) [Epic Username]',
    examples: ['duo Ninja', 'duo ps4 PrismR22', 'duo xbox <insert an xbox player\'s name here cause idk any lol>', 'duo psn psn(skyray11)']
};