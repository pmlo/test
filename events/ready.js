module.exports = (client) => {
    client.user.setActivity(`uFc4 | ${client.users.size} Membres !`, {type: "STREAMING", url:"https://www.twitch.tv/lafrancedefortnite"});
    console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
    client.channels.get("664916311838687242").send(`:white_check_mark: Bot **${client.user.username}** en ligne, Prêt à travailler !`);

};
