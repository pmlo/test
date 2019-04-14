const fetch = require('node-fetch');
const Discord = require('discord.js');
// const moment = require('moment-timezone');

exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
    const item = args.splice(0, args.length).join(' ');
    if (!item) return message.channel.send(`Item name missing! Try ${client.config.prefix}item <item name>`);
    let itemID;
    let link = 'https://fortnite-public-api.theapinetwork.com/prod09/items/list';
    fetch(link).then(result => result.json()).then(async list => {
        const itemlist = list.find(post => post.name.toUpperCase() === (item.toString()).toUpperCase());
        itemID = itemlist.identifier;
        // console.log(itemID);
        if (!itemID) return message.reply('Item not found!');
        link = `https://fortnite-public-api.theapinetwork.com/prod09/item/get?ids=${itemID}`;
        fetch(link).then(result => result.json()).then(async res => {
            // console.log(res);
            let type;
            switch (res.type) {
                case 'outfit': type = 'Outfit';break;
                case 'glider': type = 'Glider';break;
                case 'pickaxe': type = 'Pickaxe';break;
                case 'backpack': type = 'Back Bling';break;
                case 'emote': type = 'Emote';break;
                case 'spray': type = 'Spray';break;
                case 'skydive': type = 'Contrail';break;
                default: type = res.type;
            }
            let rarity;
            switch (res.rarity) {
                case 'legendary': rarity = 'Legendary';break;
                case 'epic': rarity = 'Epic';break;
                case 'rare': rarity = 'Rare';break;
                case 'uncommon': rarity = 'Uncommon';break;
                case 'common': rarity = 'Common';break;
                default: rarity = '';
            }
            let obtain = '';
            if (res.obtained_type === 'battlepass') {
                obtain = `${res.obtained.includes('Battlepass') ?  res.obtained :  'Battlepass ' + res.obtained}`;
            } else if (res.obtained_type === 'vbucks') {
                obtain = `${client.emojis.get('531875969200422944')} ${res.obtained}`;
            } else obtain = res.obtained;
            let todaystore = '';
            if (res.todaystore === 1) {
                todaystore = '**This item is in the store today!**\n\n';
            }
            let setName = '';
            if (res.set.name) {
                setName = `\nPart of the **${res.set.name}** set.`;
            }
            const embed = new Discord.RichEmbed()
                .setColor(message && message.guild ? message.guild.me.displayHexColor : '#35c7e4')
                .setTitle(`${res.name} - ${rarity} ${type} - ${obtain}`)
                .setDescription(`${todaystore}${res.description}${setName}`)
                .setThumbnail(res.images.background);
            if (res.obtained_type === 'vbucks') embed.addField('Dernière apparition dans la Boutique',`Release: ${res.occurrences.first}\nLast seen: ${res.occurrences.last}\nOccurrences: ${res.occurrences.occurrences}`);
            const entries = [];
            if (res.set.name) {
                res.set.entries.forEach(entry => {
                    entries.push(entry.name);
                });
                embed.addField(`The ${res.set.name} Set`, entries.join(', '));
            }
            message.channel.send(embed); 

        }).catch(err => console.error(err));
    }).catch(err => console.error(err));
};

exports.help = {
    name: 'item',
    description: 'Sends information about a cosmetic item.',
    usage: 'item [Item Name]',
    examples: ['item Fate', 'item fishstick', 'item true heart']
};