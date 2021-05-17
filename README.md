# ReminderBot: A lightweight reminder manager for Discord

## Update v1.1: Slash commands are now out! 
### Changelog
* Using the latest version of Discord.js (v13 master branch), ReminderBot now listens to Discord interactions using slash commands. To get info on all the commands and use them, all you need to do is to type `/` in the DM channel.
* Added the `/clear` command for removing all reminders
* Adding and removing a reminder will now automatically bring up the list of reminders
* The `date` parameter is now optional and will now default to the current day of the user

This is a lightweight Discord bot that allows you to set reminders to ping yourself with a direct message at a specified time. Schedule messages easily and manage your reminders by direct messaging the bot with simple commands!

## Add this bot
[Click here](https://discord.com/api/oauth2/authorize?client_id=843908993491533885&permissions=0&scope=bot) to invite the bot to your server, no permissions required.

## Usage
All interactions take place via direct messages. When you invite the bot to a server, everyone on the server can start using this bot if their DM settings allow it.

Before you start using the bot, you must type `/timezone <offset>` where `<offset>` is the number of hours your time zone is offset from Coordinated Universal Time. [Click here](https://www.timeanddate.com/time/map/) to find your time zone. The offset is the number at the bottom of the map on the highlighted strip when you hover over your location. 

All other commands can be found by typing `/` and checking the slash commands under the ReminderBot tab.

## Upcoming Features
* Support for relative time units when creating a reminder
* Support for intervals (repeating reminders)
