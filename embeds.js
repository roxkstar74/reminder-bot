const Discord = require("discord.js");
const blue = "#06B6D4";
const red = "#EF4444";
const green = "#22C55E";

exports.help = (commands) => {
    const embed = new Discord.MessageEmbed().setTitle("Commands List").setColor(blue);
    for (const command of commands) embed.addField(command.title, command.description, false);
    embed.setFooter("Created by pblpbl#5115");
    return embed;
};

exports.noReminders = () => {
    return new Discord.MessageEmbed().setColor(blue).setTitle("Reminders List").setDescription("There are no active reminders.").setFooter("Created by pblpbl#5115");
};

exports.error = (msg) => {
    return new Discord.MessageEmbed().setColor(red).setTitle("Error").setDescription(msg).setFooter("Created by pblpbl#5115");;
};

exports.addReminder = (reminder) => {
    const embed = new Discord.MessageEmbed().setColor(green).setTitle("Reminder Set Successfully");
    embed.addField("Message", reminder.msg, true);
    embed.addField("Date", reminder.dateStr, true);
    embed.setFooter("Created by pblpbl#5115");
    return embed;
};

exports.removeReminder = () => {
    return new Discord.MessageEmbed().setColor(green).setTitle("Reminder Removed Successfully").setFooter("Created by pblpbl#5115");
};

exports.removeAllReminders = () => {
    return new Discord.MessageEmbed().setColor(green).setTitle("All Reminders Removed Successfully").setFooter("Created by pblpbl#5115");
};

exports.remindersList = (reminders) => {
    const embed = new Discord.MessageEmbed().setColor(blue).setTitle("Reminders List");
    reminders.forEach((reminder, idx) => {
        embed.addField("Message", `${reminder.msg}`, true);
        embed.addField("Date", reminder.dateStr, true);
        embed.addField("ID", idx, true);
    });
    embed.setFooter("Created by pblpbl#5115");
    return embed;
};