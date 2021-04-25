const embeds = require("../embeds");
module.exports = {
    name: "help",
    aliases: [],
    title: "`.r help`",
    description: "Sends the list of commands.",
    run(message, args) {
        message.channel.send(embeds.help(commands));
    }
};