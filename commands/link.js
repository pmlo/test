exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars

    let platform;
    let query;
    const platforms = ['xbox', 'xb1', 'xbox1', 'xbox one', 'xbl', 'playstation', 'ps4', 'ps', 'playstation 4', 'psn', 'computer', 'pc'];
    if (platforms.indexOf(args[0]) !== -1) {
        platform = args[0];
        query = args.splice(1, args.length).join(' ');
    } else {
        platform = 'pc';
        query = args.splice(0, args.length).join(' ');
    }
    if (!query) return message.channel.send("<:No:566681468420489248> Erreur ! Assurez-vous d'entrer votre plate-forme et votre nom d'utilisateur ! ");
    const user = platform + ':' + query;
    try {
        client.fortnitedb.set(message.author.id, user);
    } catch (error) {
        message.channel.send('<:No:566681468420489248> Une erreur est survenue ! Pardon');
        return console.log(error);
    } message.channel.send('<:Yes:566681458928910367> Compte lié avec succès !');
};

exports.help = {
    name: 'link',
    description: 'Link your Discord ID and Epic username',
    usage: 'link (Platform) [Epic Username]',
    examples: ['link tfue', 'link ps4 ZeroSiks', 'link xbl <insert an xbox player\'s name here cause idk any lol>']
};