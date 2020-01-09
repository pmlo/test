exports.run = (client, message, args) => {
    message.channel.send(":ping_pong: Pong ! (`"+ `${message.createdTimestamp - Date.now()}` + '` ms)');
    client.channels.get("664916311838687242").send("Log / Utilisateur **" + message.author.username + "** / Commande **Ping**");
};

exports.info = {
    name: 'ping',
    description: 'Afficher le ping du bot',
    usage: 'ping'
};
