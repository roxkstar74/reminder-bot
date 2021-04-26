![Set a reminder for tomorrow so you don't miss this important webinar.](https://github.com/pblpbl1024/reminder-bot/blob/main/assets/p1.png)

One day later, out of nowhere:

![A reminder shows up telling you your important note](https://github.com/pblpbl1024/reminder-bot/blob/main/assets/p2.png)

# ReminderBot
This is a lightweight Discord bot that allows you to set reminders to ping yourself with a direct message at a specified time. Schedule messages easily and manage your reminders by direct messaging the bot with simple commands!

## Add ReminderBot to your server
[Click here](https://discord.com/api/oauth2/authorize?client_id=834503689452257322&permissions=0&scope=bot) to invite the bot to your server, no permissions required.

## Usage
Before you start using the bot, **you must type `.r set <offset>` where `<offset>` is the number of hours your time zone is offset from Coordinated Universal Time.** [Click here](https://www.timeanddate.com/time/map/) to find your time zone.

To get help for all the commands, type `.r help`. Here's a list of them for convenience:
* `.r add <hour:minute><am|pm> <month/day/year> <message>`

  Sets a reminder to ping you at a specific time.

  If a year is not specified, the current year is used by default.
 
* `.r list`

Lists all active reminders with their IDs. Reminders are always sorted by time.

* `.r remove <id|all>`

  Removes an active reminder by its ID as shown when you type `.r list`, or removes all active reminders if you type `.r remove all`.
  
* `.r set <offset>`
Sets your current time zone offset from UTC (in hours). It is strongly recommended that you clear all reminders after changing this offset.

## Upcoming Features
* Support for relative time units when creating a reminder
* Support for repeating reminders
