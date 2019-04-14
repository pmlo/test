const Discord = require('discord.js');
const client = new Discord.Client(),
    Enmap = require('enmap'),
    fs = require('fs');

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

client.login(process.env.token);