const userSchema = require("../models/user");
const embeds = require("../embeds");

module.exports = {
    name: "set",
    aliases: [],
    title: "`.r set <offset>`",
    description: "Sets your current time zone offset from UTC (in hours). This command needs to be used before reminders can be added. It is strongly recommended that you clear all reminders after changing this offset",
    run(message, args) {
        const { channel, author } = message;
        if (args.length !== 1) { channel.send(embeds.error("Invalid number of arguments.")); return; }
        const offset = parseInt(args[0]);
        if (isNaN(offset) || offset < -11 || offset > 14) { channel.send(embeds.error("Invalid offset. The value must be an integer between `-11` and `14`.")); return; }
        userSchema.findById(author.id).then(user => {
            if (!user) {
                new userSchema({
                    _id: author.id,
                    reminders: [],
                    offset: offset
                }).save();
            } else {
                user.offset = offset; user.save();
            }
            channel.send(embeds.updateOffset(offset));
        });
    }
};