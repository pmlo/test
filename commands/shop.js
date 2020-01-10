const fetch = require('node-fetch'),
    Canvas = require('canvas'),
    Discord = require('discord.js'),
    snekfetch = require('snekfetch'),
    moment = require('moment-timezone');

function daTe(d1) {
    const d2 = moment.unix(d1);
    const d3 = moment.tz(d2, 'Indian/Maldives').format('Do MMMM YYYY, h:mm A');
    return d3;
}
const getTimeLeft = function() {
    const now = moment.utc();
    const deadline = now.clone().hour(0).minute(0).second(0);
    if (now.isAfter(deadline)) {
        const tomorrow = moment.utc(new Date()).add(1, 'days').hour(0).minute(0).second(0);
        return tomorrow.diff(now, 'hours') + ' hrs, ' + (tomorrow.diff(now, 'minutes') % 60) + ' mins';
    } else {
        return deadline.diff(now, 'hours') + ' hrs, ' + (deadline.diff(now, 'minutes') % 60) + ' mins';
    }
};

exports.run = async (client, message) => {
    const link = 'https://fortnite-public-api.theapinetwork.com/prod09/store/get';
    fetch(link).then(result => result.json()).then(async res => {
        const ordering = {},
            sortOrder = ['legendary','epic','rare','uncommon','common'];
        for (let i=0; i<sortOrder.length; i++)
            ordering[sortOrder[i]] = i;

        res.items.sort( function(a, b) {
            return (ordering[a.item.rarity] - ordering[b.item.rarity]);
        });

        const featured = [], daily = [];
        res.items.forEach(item => {
            if (item.featured === 1) {
                featured.push(item);
            } else {
                daily.push(item);
            }
        });

        const length = Math.ceil((daily.length / 4) * 200) + Math.ceil((featured.length / 4) * 200);

        Canvas.registerFont('./assets/LuckiestGuy.ttf', { family: 'luckiestguy' });
        const canvas = Canvas.createCanvas(875, length + 280);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('./assets/wallpaper2.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = '40px "luckiestguy"';
        ctx.fillStyle = '#99AAB5';

        ctx.fillText('Featured', 25, 45);
        ctx.fillText('Daily', 25, Math.ceil((featured.length / 4) * 200) + 160);

        let num = 0;
        for (let i = 0; i < (Math.ceil(featured.length / 4)); i++) {
            for (let j = 0; j < 4; j++) {
                if (num < featured.length) {
                    const { body: buffer } = await snekfetch.get(featured[num].item.images.information);
                    const avatar = await Canvas.loadImage(buffer);
                    ctx.drawImage(avatar, (j * 205) + 25, (i * 205) + 55, 200, 200);
                    num++;
                }
            }
        }

        num = 0;
        for (let i = 0; i < (Math.ceil(daily.length / 4)); i++) {
            for (let j = 0; j < 4; j++) {
                if (num < daily.length) {
                    const { body: buffer } = await snekfetch.get(daily[num].item.images.information);
                    const avatar = await Canvas.loadImage(buffer);
                    ctx.drawImage(avatar, (j * 205) + 25, (i * 205) + Math.ceil((featured.length / 4) * 200) + 170, 200, 200);
                    num++;
                }
            }
        }

        const attachment = new Discord.Attachment(canvas.toBuffer(), 'shop.png');

        const sendEmbed = (channel) => {
            let myRole = message.guild.roles.find(role => role.name === "『BOUTIQUE FORTNITE』");
            client.channels.get("661697068871581697").sendMessage("Mention : " + myRole);
            const embed = new Discord.RichEmbed()
                .setColor('#6302c5')
                .setTitle(`Boutique Fortnite - ${getTimeLeft()} till reset`)
                .setDescription("N’oublie pas de mettre dans la Boutique notre Code Créateur :\n **LFDF-TOURNOI**")
                .attachFile(attachment)
                .setImage('attachment://shop.png')
                .setFooter("By La France De Fortnite");
            channel.send(embed);
        };
        const lastupdate = res.lastupdate.toString();
        if (message) {
            sendEmbed(message.channel);
        } else {
            const oldShopDate = client.autoCheck.get('shop_latest');
            if (!oldShopDate) {
                console.log('Shop time set! ' + lastupdate);
                client.autoCheck.set('shop_latest', lastupdate);
                return;
            }
            if (oldShopDate === lastupdate) return;
            if (parseInt(oldShopDate, 10) > parseInt(lastupdate, 10)) return;
            client.config.auto_channels.forEach(function(chan) {
                const notify_channel = client.channels.find(x => x.id === chan);
                sendEmbed(notify_channel);
            });
            client.autoCheck.set('shop_latest', lastupdate);
            console.log('New latest shop time set! ' + lastupdate);
        }
        //By Stricix
    }).catch(err => console.error(err));
};

exports.help = {
    name: 'shop',
    description: 'Generates an image of the current item shop',
    usage: 'shop'
};
