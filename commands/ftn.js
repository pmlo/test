const Discord = require('discord.js');
const fn = require('fortnite');
const Canvas = require('canvas');

exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
    Canvas.registerFont('./assets/LuckiestGuy.ttf', { family: 'luckiestguy' });
    Canvas.registerFont('./assets/Faruma.ttf', { family: 'faruma' });
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
            const lifetime = result.stats.lifetime;

            const statz = {
                Score: lifetime[6]['Score'],
                Played: lifetime[7]['Matches Played'],
                Wins: lifetime[8]['Wins'],
                WinRate: lifetime[9]['Win%'],
                Kills: lifetime[10]['Kills'],
                KD: lifetime[11]['K/d']
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
                    case 'v1':
                    case 'old':
                    case 'embed': {
                        const embed = new Discord.RichEmbed()
                            .setColor(message.guild.me.displayHexColor ? message.guild.me.displayHexColor : '#35c7e4')
                            .setTitle(`Fortnite Stats for ${result.username} on ${result.platform}`)
                            .setURL(result.url)
                            .setFooter('Data provided by FortniteTracker')
                            .setThumbnail('https://pbs.twimg.com/profile_images/991264373086871553/q3bnn-BT.jpg')
                            .addField('Matches Played', statz.Played, true)
                            .addField('Wins', `${statz.Wins} (${statz.WinRate} Winrate)`, true)
                            .addField('Kills', `${statz.Kills} (${statz.KD} K/D)`, true)
                            .addField('Total Score', statz.Score,true);
                        message.channel.send({embed});
                    }
                        break;
                    case 'v2':
                    case 'new':
                    default: {
                        const solo = result.stats.solo;
                        const duo = result.stats.duo;
                        const squad = result.stats.squad;
                        const canvas = Canvas.createCanvas(800, 600);
                        const ctx = canvas.getContext('2d');

                        const background = await Canvas.loadImage('./assets/fishbotlayout2.png');
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                        const ree = result.username;
                        ctx.font = '28px luckiestguy';
                        ctx.fillStyle = '#000000';
                        ctx.fillText(ree, 22, 50);

                        ctx.font = '22px luckiestguy';
                        ctx.fillText(plat, 22, 85);

                        ctx.font = '26px faruma';
                        ctx.fillText('ލޯލް', 60, 150);
                        
                        ctx.font = '20px luckiestguy';
                        ctx.fillStyle = '#000000';
                        ctx.fillText(statz.Played, 305, 49);
                        ctx.fillText(statz.Wins, 460, 49);
                        ctx.fillText(statz.WinRate, 305, 75);
                        ctx.fillText(statz.Kills, 640, 49);
                        ctx.fillText(statz.KD, 460, 75);
                        ctx.fillText(statz.Score, 640, 75);

                        ctx.font = '26px luckiestguy';

                        ctx.fillText(solo.matches, 174, 212);
                        ctx.fillText(solo.wins, 174, 276);
                        ctx.fillText((Math.round((solo.wins / solo.matches) * 10000) / 100) + '%', 174, 343);
                        ctx.fillText(solo.kills, 174, 405);
                        ctx.fillText(solo.kd, 174, 470);
                        ctx.fillText(solo.score, 174, 533);
                        
                        // console.log(solo);
                        ctx.fillText(duo.matches, 324, 212);
                        ctx.fillText(duo.wins, 324, 276);
                        ctx.fillText((Math.round((duo.wins / duo.matches) * 10000) / 100) + '%', 324, 343);
                        ctx.fillText(duo.kills, 324, 405);
                        ctx.fillText(duo.kd, 324, 470);
                        ctx.fillText(duo.score, 324, 533);

                        ctx.fillText(squad.matches, 490, 212);
                        ctx.fillText(squad.wins, 490, 276);
                        ctx.fillText((Math.round((squad.wins / squad.matches) * 10000) / 100) + '%', 490, 343);
                        ctx.fillText(squad.kills, 490, 405);
                        ctx.fillText(squad.kd, 490, 470);
                        ctx.fillText(squad.score, 490, 533);

                        ctx.fillText('W.I.P', 660, 212);

                        const attachment = new Discord.Attachment(canvas.toBuffer(), './ree.png');
                        const embed = new Discord.RichEmbed()
                            .setColor('#99AAB5')
                            .setDescription(`📈 **Statistique Fortnite de ${message.member.user}**`)
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
//By Stricix
exports.help = {
    name: 'fn',
    description: 'Fetches overall fortnite stats for a user from The Fortnite Tracker',
    usage: 'fn (Platform) [Epic Username]',
    examples: ['fn Ninja', 'fn ps4 PrismR22', 'fn xbox <insert an xbox player\'s name here cause idk any lol>', 'fn psn psn(skyray11)']
};
