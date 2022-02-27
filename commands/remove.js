const userSchema = require("../models/user");
const embeds = require("../embeds");

module.exports = {
    data: {
        name: "remove",
        description: "Removes a specific reminder by ID.",
        options: [
            {
                name: "index",
                type: "INTEGER",
                description: "The position of the reminder in the list to delete",
                required: true
            }
        ]
    },
    run(interaction) {
        const { options, user } = interaction; const args = options.map(option => option.value);
        let idx = parseInt(args[0]);
        userSchema.findById(user.id).then(u => {
            if (!u || isNaN(idx) || idx < 0 || idx >= u.reminders.length) {
                interaction.reply(embeds.error("Invalid id. The id should be an integer obtained from the `list` command."));
            } else {
                if(u.reminders.length > idx + 1 && u.reminders[idx + 1].msg === u.reminders[idx].msg + ' - in one hour!') {
                    u.reminders.splice(idx, 2);
                }
                else {
                    u.reminders.splice(idx, 1);
                }
                u.save();
                interaction.reply(embeds.remindersList(u.reminders, u.offset));
            }
        });
    }
};