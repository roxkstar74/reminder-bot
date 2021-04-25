const userSchema = require("../models/user");
const embeds = require("../embeds");

module.exports = {
    name: "remove",
    aliases: [],
    title: "`.r remove <id|all>`",
    description: "Removes an active reminder by its ID as shown in `.r list`, or removes all active reminders.\nReminder IDs are always sorted by time, so if you updated the reminder list, run `.r list` to see the updated IDs.",
    run(message, args) {
        const { channel, author } = message;
        if (args[0].toLowerCase() === "all") {
            console.log("removing all");
            userSchema.findById(author.id).then(user => {
                if (user) { user.reminders = []; user.save(); }
                channel.send(embeds.removeAllReminders());
            });
        } else {
            let idx = parseInt(args[0]);
            userSchema.findById(author.id).then(user => {
                if (!user || isNaN(idx) || idx < 0 || idx >= user.reminders.length) {
                    channel.send(embeds.error("Invalid id. The id should be an integer obtained from the `.r list` command."));
                } else {
                    user.reminders.splice(idx, 1);
                    user.save();
                    channel.send(embeds.removeReminder());
                }
            });
        }
    }
};