exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    const fnID = client.fortnitedb.get(message.author.id);
    if (fnID) {
        client.fortnitedb.delete(message.author.id);
    } else return message.channel.send("Vous n'avez pas de compte lié ! ");
    message.channel.send('Compte dissocié avec succès !');
};

exports.help = {
    name: 'unlink',
    description: 'Unlink your Epic username from Discord',
    usage: 'unlink'
};