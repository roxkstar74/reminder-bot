const userSchema = require("../models/user");
const embeds = require("../embeds");

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

module.exports = {
    data: {
        name: "add",
        description: "Sets a reminder to ping you at a specific time.",
        options: [
            {
                name: "message",
                type: "STRING",
                description: "The message you will get pinged with.",
                required: true,
            },
            {
                name: "time",
                type: "STRING",
                description: "<hour:minute><am|pm>",
                required: true,
            },
            {
                name: "date",
                type: "STRING",
                description: "<month/day/year> (leave blank to use today, or leave year blank to use current year)",
                required: false,
            }
        ]
    },
    run(interaction) {
        const { options, user } = interaction; const args = options.map(option => option.value);
        userSchema.findById(user.id).then(u => {
            if (!u) {
                channel.send(embeds.error("Use `/timezone` to set your time zone before you can add reminders."));
            } else {
                //check each argument against these strings to be more accurate
                const v = args[1].substring(args[1].length - 2).toUpperCase();
                const time = args[1].substring(0, args[1].length - 2).split(":");
                if (time.length !== 2 || (v !== "AM" && v !== "PM")) { interaction.reply(embeds.error("Invalid time format. The required format is `<hour>:<minute><am|pm>`.")); return; }

                //convert currentTime to local user time: +offset
                const userNow = new Date();
                userNow.setTime(userNow.getTime() + u.offset * 60 * 60 * 1000);
                let date = [userNow.getMonth() + 1, userNow.getDate(), userNow.getFullYear()];
                console.log(date);
                if (options.length == 3) {
                    date = args[2].split("/");
                    if (date.length == 2) { date[2] = userNow.getFullYear(); }
                    else if (date.length !== 3) { interaction.reply(embeds.error("Invalid date format. The required format is `<month/day/year>`, or leave `year` blank to use the current year.")); return; }
                }
                const msg = args[0];
                //completely parse everything here to make sure there's no errors (note that if the array value doesn't exist, one will automatically be created)
                time[0] = parseInt(time[0]); time[1] = parseInt(time[1]);
                date[0] = parseInt(date[0]); date[1] = parseInt(date[1]); date[2] = parseInt(date[2]);
                console.log(time[0], time[1], date[0], date[1], date[2], msg);

                if (isNaN(time[0]) || time[0] < 1 || time[0] > 12) { interaction.reply(embeds.error("Invalid hour. The value must be an integer between `1` and `12`.")); return; }
                if (isNaN(time[1]) || time[1] < 0 || time[1] > 59) { interaction.reply(embeds.error("Invalid minute. The value must be an integer between `0` and `59`.")); return; }
                if (isNaN(date[0]) || date[0] < 1 || date[0] > 12) { interaction.reply(embeds.error("Invalid month. The value must be an integer between `1` and `12`.")); return; }
                if (isNaN(date[0]) || date[1] < 1 || date[1] > 31) { interaction.reply(embeds.error("Invalid day. The value must be an integer between `1` and `31`.")); return; }
                if (isNaN(date[2]) || date[2] < 2000 || date[2] > 2100) { interaction.reply(embeds.error("Invalid year. The value must be an integer between `2000` and `2100`.")); return; }

                let dateValue = 0;
                if (v === "AM" && time[0] === 12) {
                    dateValue = new Date(date[2], date[0] - 1, date[1], time[0]-12, time[1]).getTime() - u.offset * 60 * 60 * 1000;
                }
                else if (v === "PM" && time[0] !== 12) {
                    dateValue = new Date(date[2], date[0] - 1, date[1], time[0]+12, time[1]).getTime() - u.offset * 60 * 60 * 1000;
                }
                //construct reminder object
                time[1] = pad(time[1], 2);
                const reminder = {
                    //local user time to system time: -offset
                    date: dateValue,
                    dateStr: [time.join(":"), v, date.join("/")].join(" "),
                    msg: msg
                };

                if (reminder.date <= new Date().getTime()) { interaction.reply(embeds.error("The time for this reminder has already passed.")); return; }

                //update the database
                //push it into the array, then sort it by inserting it in place
                u.reminders.push(reminder);
                for (let i = u.reminders.length - 2; i >= 0; i--) {
                    if (u.reminders[i].date > u.reminders[i + 1].date)
                        [u.reminders[i], u.reminders[i + 1]], [u.reminders[i + 1], u.reminders[i]];
                }
                u.save();
                interaction.reply(embeds.remindersList(u.reminders));
            }
        });
    }
};