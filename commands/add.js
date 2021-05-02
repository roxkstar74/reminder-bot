const userSchema = require("../models/user");
const embeds = require("../embeds");

module.exports = {
    name: "add",
    aliases: [],
    title: "`.r add <hour:minute><am|pm> <month/day/year> <message>`",
    description: "Sets a reminder to ping you at a specific time. `date`, `time`, and `message` can appear in any order; however, `message` cannot contain the `:` or `/` character.",
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
                //assign the time, date, and message 
                let time, date, v, msg = "", timeStr;
                for (const str of args) {
                    if (str.includes(":")) {
                        v = str.substring(str.length - 2).toLowerCase();
                        time = str.substring(0, str.length - 2).split(":"); timeStr = time.slice(0);
                    }
                    else if (str.includes("/")) date = str.split("/");
                    else msg += str + " ";
                }
                if (time.length !== 2 || (v !== "am" && v !== "pm")) { channel.send(embeds.error("Invalid time format. The required format is `<hour>:<minute><am|pm>`.")); return; }

                if (date.length == 2) { date[2] = new Date().getFullYear(); }
                else if (date.length !== 3) { channel.send(embeds.error("Invalid date format. The required format is `<month/day/year>`, or leave `year` blank to use the current year.")); return; }

                //completely parse everything here to make sure there's no errors (note that if the array value doesn't exist, one will automatically be created)
                time[0] = parseInt(time[0]); time[1] = parseInt(time[1]);
                date[0] = parseInt(date[0]); date[1] = parseInt(date[1]); date[2] = parseInt(date[2]);
                console.log(time[0], time[1], date[0], date[1], date[2]);

                if (isNaN(time[0]) || time[0] < 1 || time[0] > 12) { channel.send(embeds.error("Invalid hour. The value must be an integer between `1` and `12`.")); return; }
                if (isNaN(time[1]) || time[1] < 0 || time[1] > 59) { channel.send(embeds.error("Invalid minute. The value must be an integer between `0` and `59`.")); return; }
                if (isNaN(date[0]) || date[0] < 1 || date[0] > 12) { channel.send(embeds.error("Invalid month. The value must be an integer between `1` and `12`.")); return; }
                if (isNaN(date[0]) || date[1] < 1 || date[1] > 31) { channel.send(embeds.error("Invalid day. The value must be an integer between `1` and `31`.")); return; }
                if (isNaN(date[2]) || date[2] < 2000 || date[2] > 2100) { channel.send(embeds.error("Invalid year. The value must be an integer between `2000` and `2100`.")); return; }

                if (v === "am" && time[0] === 12) time[0] -= 12;
                else if (v === "pm" && time[0] !== 12) time[0] += 12;

                //construct reminder object
                const reminder = {
                    date: new Date(date[2], date[0] - 1, date[1], time[0], time[1]).getTime() - user.offset * 60 * 60 * 1000,
                    dateStr: [timeStr.join(":"), v.toUpperCase(), date.join("/")].join(" "),
                    msg: msg
                };

                if (reminder.date <= new Date().getTime()) { channel.send(embeds.error("The time for this reminder has already passed.")); return; }

                //update the database 
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