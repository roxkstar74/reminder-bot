const userSchema = require("../models/user");
const embeds = require("../embeds");

module.exports = {
    name: "list",
    aliases: [],
    title: "`.r list`",
    description: "Lists all active reminders with their IDs.",
    run(message, args) {
        const { channel, author } = message;
        userSchema.findById(author.id).then(user => {
            if (!user) {
                channel.send(embeds.noReminders());
            } else {
                if (user.reminders.length == 0) channel.send(embeds.noReminders());
                else channel.send(embeds.remindersList(user.reminders));
            }
        });
    }
};