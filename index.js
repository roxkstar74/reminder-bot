const Discord = require("discord.js");
const fs = require("fs");
require("dotenv").config();
const mongoose = require("mongoose");
const userSchema = require("./models/user");
const embeds = require("./embeds");

//initialize connection to mongodb server
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/reminder-bot", {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
}).on("error", e => {
    console.log("Connection error:", e);
});

//initialize discord client
const client = new Discord.Client();
client.login(process.env.TOKEN);
client.once("ready", () => {
    console.log("Bot started.");
    console.log(new Date().getTimezoneOffset());
    //this fetch function can get any user without relying on cache
    //client.users.fetch("371785429113896965").then(res => console.log(res));
});

//load all commands into a global variable
const commandFiles = fs.readdirSync("./commands");
commands = [];
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command);
}

//console.log(commands);

client.on("message", async message => {
    const { channel, content, author } = message;
    if (channel.type !== "dm" || author.bot) return;
    let prefix = ".r";

    //trim extra space around the edges and reduce middle spaces to one space, then convert it to an array
    const msg = content.replace(/\s+/g, " ").trim().split(" ");
    //check if the message starts with the prefix or starts with pinging the bot
    if (msg[0] !== prefix && msg[0] !== `<@!${client.user.id}>`) return;

    if (msg.length < 2) {
        channel.send(`Error: Command not specified. Type \`.remind help\` for information on how to use this bot.`); return;
    }

    //handles commands
    const cmd = msg[1], args = msg.slice(2);
    console.log(`${author.username} ran command "${cmd}" with arguments "${args}".`);
    for (const command of commands) {
        if (cmd === command.name || command.aliases.includes(cmd)) {
            command.run(message, args);
            break;
        }
    }
});

var interval = 60000;
var delay = (60 - new Date().getSeconds()) * 1000;
var expected = Date.now() + delay;
setTimeout(step, delay);
function step() {
    var dt = Date.now() - expected; // the drift (positive for overshooting, negative for undershooting)
    if (dt > interval) {
        setTimeout(step, -dt);
    }
    else {
        //do what is to be done normally
        //console.log(dt);
        //query all users and check if there are any reminders that should go off
        const now = new Date();
        userSchema.find().then(userList => {
            //loop through all user entries
            for (const user of userList) {
                console.log(user);
                for (let i = 0; i < user.reminders.length; i++) {
                    if (user.reminders[i].date <= now.getTime()) {
                        //ping the user with the reminder, delete this reminder, and update the index
                        //since this function is asynchronous, store the message in a variable
                        let m = user.reminders[i].msg;
                        client.users.fetch(user._id).then(u => u.send(`<@${u.id}> ${m}`));
                        user.reminders.splice(i, 1); i--;
                    }
                }
                user.save();
            }
        });
        console.log(new Date().getTime());
        expected += interval;
        setTimeout(step, Math.max(0, interval - dt));
    }
}