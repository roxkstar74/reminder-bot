const userSchema = require("../models/user");
const embeds = require("../embeds");

module.exports = {
    name: "add",
    aliases: [],
    title: "`.r add <hour:minute><am|pm> <month/day/year> <message>`",
    description: "Sets a reminder to ping you at a specific time.\nIf a year is not specified, the current year is used by default.",
    run(message, args) {
        const { channel, author } = message;
        userSchema.findById(author.id).then(user => {
            if (!user) {
                channel.send(embeds.error("Use `.r set <offset>` to set your time zone before you can add reminders."));
            } else {
                //check each argument against these strings to be more accurate 
                if (args.length < 3) {
                    channel.send(embeds.error("Invalid number of arguments.")); return;
                }
                const v = args[0].substring(args[0].length - 2).toLowerCase();
                const time = args[0].substring(0, args[0].length - 2).split(":");
                if (time.length !== 2 || (v !== "am" && v !== "pm")) { channel.send(embeds.error("Invalid time format. The required format is `<hour>:<minute><am|pm>`.")); return; }

                const date = args[1].split("/");
                if (date.length == 2) { date[2] = new Date().getFullYear(); }
                else if (date.length !== 3) { channel.send(embeds.error("Invalid date format. The required format is `<month/day/year>`, or leave `year` blank to use the current year.")); return; }
                const msg = args.slice(2).join(" ");

                //completely parse everything here to make sure there's no errors (note that if the array value doesn't exist, one will automatically be created)
                time[0] = parseInt(time[0]); time[1] = parseInt(time[1]);
                date[0] = parseInt(date[0]); date[1] = parseInt(date[1]); date[2] = parseInt(date[2]);
                console.log(time[0], time[1], date[0], date[1], date[2]);

                if (isNaN(time[0]) || time[0] < 1 || time[0] > 12) { channel.send(embeds.error("Invalid hour. The value must be an integer between `1` and `12`.")); return; }
                if (isNaN(time[1]) || time[1] < 1 || time[1] > 59) { channel.send(embeds.error("Invalid minute. The value must be an integer between `0` and `59`.")); return; }
                if (isNaN(date[0]) || date[0] < 1 || date[0] > 12) { channel.send(embeds.error("Invalid month. The value must be an integer between `1` and `12`.")); return; }
                if (isNaN(date[0]) || date[1] < 1 || date[1] > 31) { channel.send(embeds.error("Invalid day. The value must be an integer between `1` and `31`.")); return; }
                if (isNaN(date[2]) || date[2] < 2000 || date[2] > 2100) { channel.send(embeds.error("Invalid year. The value must be an integer between `2000` and `2100`.")); return; }

                if (v === "am" && time[0] === 12) time[0] -= 12;
                else if (v === "pm" && time[0] !== 12) time[0] += 12;

                //construct reminder object
                const reminder = {
                    date: new Date(date[2], date[0] - 1, date[1], time[0], time[1]).getTime() - user.offset * 60 * 60 * 1000,
                    dateStr: [args[0].toLowerCase(), date.join("/")].join(" "),
                    msg: msg
                };

                //update the database {
                //push it into the array, then sort it by inserting it in place
                user.reminders.push(reminder);
                for (let i = user.reminders.length - 2; i >= 0; i--) {
                    if (user.reminders[i].date > user.reminders[i + 1].date)
                        [user.reminders[i], user.reminders[i + 1]], [user.reminders[i + 1], user.reminders[i]];
                }
                user.save();
                channel.send(embeds.addReminder(reminder));
            }
        });
    }
};