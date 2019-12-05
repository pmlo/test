module.exports = (client) => {
    client.user.setActivity(`LFDF | ${client.users.size} Membres !`, {type: "STREAMING", url:"https://www.twitch.tv/lafrancedefortnite"});
    console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
    client.channels.get("540107675397128202").send(`:white_check_mark: Bot **${client.user.username}** en ligne, Prêt à travailler !`);

};
