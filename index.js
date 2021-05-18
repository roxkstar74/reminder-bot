const { Client, Intents } = require("discord.js");
const fs = require("fs");
require("dotenv").config();
const mongoose = require("mongoose");
const { run } = require("./commands/add");
const userSchema = require("./models/user");

const commandFiles = fs.readdirSync("./commands");
const commands = [], data = [];

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
const myIntents = new Intents();
myIntents.add('GUILD_PRESENCES', 'GUILD_MEMBERS');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(process.env.TOKEN);
client.once("ready", () => {
    console.log("Bot started.");
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command); data.push(command.data);
    }
    client.application.commands.set(data);
});

//fired when a slash command is used (interaction is a CommandInteraction objec)
client.on('interaction', interaction => {
    // If the interaction isn't a slash command, return
    if (!interaction.isCommand()) return;
    // Check if it is the correct command
    for (const command of commands) {
      if (interaction.commandName === command.data.name) command.run(interaction);
    }
});

client.on('message', async message => {

    //fetches the client application if the owner isn't defined
    if (!client.application.owner) await client.application.fetch();
    console.log(client.application.owner);

    if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application.owner.id) {
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            commands.push(command); data.push(command.data);
        }
        await client.application.commands.create(data);
        message.channel.send("Created slash commands.");
    }
});

var interval = 60000;
var delay = (60 - new Date().getSeconds()) * 1000;
var expected = Date.now() + delay;
var count = 0;
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
        count++; if (count % 60 == 0) console.log("hi");
        const now = new Date();
        userSchema.find().then(userList => {
            //loop through all user entries
            for (const user of userList) {
                //console.log(user);
                for (let i = 0; i < user.reminders.length; i++) {
                    if (user.reminders[i].date <= now.getTime()) {
                        //ping the user with the reminder, delete this reminder, and update the index
                        //since this function is asynchronous, store the message in a variable
                        let m = user.reminders[i].msg;
                        client.users.fetch(user._id).then(u => {
                            u.send(`<@${u.id}> ${m}`);
                            console.log(u.username + " was sent the reminder \"" + m + "\"");
                        });
                        user.reminders.splice(i, 1); i--;
                    }
                }
                user.save();
            }
        });
        //console.log(new Date().getTime());
        expected += interval;
        setTimeout(step, Math.max(0, interval - dt));
    }
}