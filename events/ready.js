module.exports = (client) => {
    client.user.setActivity(`LFDF | ${client.users.size} Membres !`, {type: "STREAMING", url:"https://www.twitch.tv/lafrancedefortnite"});
    console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
    client.channels.get("540107675397128202").send(`:white_check_mark: Bot **${client.user.username}** en ligne, Prêt à travailler !`);

      let interval = setInterval(() => {
        let time = new Date();
        let min = time.getMinutes();
        let heur = time.getHours();
    
        if(min == "01" && heur == "00") {
          var channel = client.channels.get('515646335513395212'); 
          channel.sendMessage("!shop");
        }
      }, 60000);
};
