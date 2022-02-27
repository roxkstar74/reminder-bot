const Discord = require("discord.js");
const blue = "#06B6D4";
const red = "#EF4444";
const green = "#22C55E";
const { format, render, cancel, register } = require('timeago.js');


exports.help = (commands) => {
    const embed = new Discord.MessageEmbed().setTitle("Commands List").setColor(blue);
    for (const command of commands) embed.addField(command.title, command.description, false);
    embed.setFooter("Created by pblpbl#5115");
    return embed;
};

exports.noReminders = () => {
    return new Discord.MessageEmbed().setColor(blue).setTitle("Reminders List").setDescription("There are no active reminders.");
};

exports.error = (msg) => {
    return new Discord.MessageEmbed().setColor(red).setTitle("Error").setDescription(msg);
};

exports.addReminder = (reminder) => {
    const embed = new Discord.MessageEmbed().setColor(green).setTitle("Reminder Set Successfully");
    embed.addField("Message", reminder.msg, true);
    embed.addField("Date", reminder.dateStr, true);
    return embed;
};

exports.removeReminder = () => {
    return new Discord.MessageEmbed().setColor(green).setTitle("Reminder Removed Successfully");
};

exports.removeAllReminders = () => {
    return new Discord.MessageEmbed().setColor(green).setTitle("All Reminders Removed Successfully");
};

exports.updateOffset = (offset) => {
    return new Discord.MessageEmbed().setColor(green).setTitle("Time Zone Offset Updated Successfully")
        .setDescription(`Your time zone is now \`${offset}\` hours from UTC.`);
};

exports.remindersList = (reminders, offset) => {

    const embed = new Discord.MessageEmbed().setColor(blue).setTitle("Reminders List");
    if(reminders.length === 0) embed.setDescription("There are no active reminders.");
    else reminders.forEach((reminder, idx) => {
        if(!reminder.hidden) return;
        embed.addField("When?", dateStr(reminder.date), true);
        embed.addField("Reminder", `${reminder.msg}`, true);
        embed.addField("ID", idx, true);
    });
    return embed;
};
//takes in any date and shows the datestring in utc

const dateStr = (d) => {
  var date = new Date(d);
  var h = date.getHours(), v = "AM";
  if(h >= 12) v = "PM";
  if(h > 12) h -= 12;
  if(h == 0) h += 12;
  return format(d);
}

const pad = (num, size) => {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}