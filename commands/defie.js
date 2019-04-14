const fetch = require('node-fetch');
const Discord = require('discord.js');
const moment = require('moment-timezone');

function getSecondPart(str, splt) {
    return str.split(splt)[1];
}

function daTe(d1) {
    const d2 = moment.unix(d1);
    const d3 = moment.tz(d2, 'Indian/Maldives').format('Do MMMM YYYY, h:mm A');
    return d3;
}

exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
    const link = 'https://api.reddit.com/user/thesquatingdog/submitted/?sort=new';
    fetch(link).then(result => result.json()).then(async res => {
        let query;
        (message) ? query = args[0] : query = null;
        let data;
        if (!query) {
            data = res.data.children.find(function(i) {
                if ((i.data.subreddit === 'FortNiteBR') && (i.data.title.includes('All Inclusive Cheat Sheet')))
                    return i.data;
            });
        } else if (query) {
            let week = '';
            const week_u = query.toString();
            data = res.data.children.find(function(i) {
                if ((i.data.subreddit === 'FortNiteBR') && (i.data.title.includes('All Inclusive Cheat Sheet'))) {
                    if ((i.data.title.includes('Season')) && (i.data.title.includes('Week'))) {
                        const secPart = getSecondPart(i.data.title, 'Week ');
                        week = secPart.charAt(0);
                        // console.log(week, week_u);
                        if (week === week_u) {
                            return i.data;
                        }
                    }
                }
            });
        }
        if (!data) {
            (message) ? message.reply('Cheatsheet not found!') : console.log('Cheatsheet not found!');
            return;
        }

        const sendEmbed = (channel) => {
            const embed = new Discord.RichEmbed()
                .setColor(message && message.guild ? message.guild.me.displayHexColor : '#35c7e4')
                .setTitle(data.data.title)
                .setImage(data.data.url)
                .setURL(`https://www.reddit.com${data.data.permalink}`);
            channel.send(embed);
        };
        // message.channel.send(embed); 
        const createdTime = data.data.created_utc.toString();
        
        if (message) {
            sendEmbed(message.channel);
        } else {
            const oldCSDate = client.autoCheck.get('cs_latest');
            if (!oldCSDate) {
                console.log('CS time set! ' + createdTime);
                client.autoCheck.set('cs_latest', createdTime);
                return;
            }
            if (oldCSDate === createdTime) return;
            if (parseInt(oldCSDate, 10) > parseInt(createdTime, 10)) return;
            client.config.auto_channels.forEach(function(chan) {
                const notify_channel = client.channels.find(x => x.id === chan);
                sendEmbed(notify_channel);
            });
            // sendEmbed(0, (client.channels.find(x => x.id === client.config.auto_channel_id)));
            client.autoCheck.set('cs_latest', createdTime);
            console.log('New latest cs time set! ' + createdTime);
        }
    }).catch(err => console.error(err));
};

exports.help = {
    name: 'defie',
    description: 'Sends thesquatingdog\'s defie for the specified or current week.',
    usage: 'defie (Week No.)',
    examples: ['defie', 'defie']
};