const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema is a defined type so that mongodb knows what type of data it is
const userSchema = new Schema({
    _id: { type: String, required: true },
    reminders: { type: Array, required: true },
});

//the string represents the actual collection name
const User = mongoose.model("User", userSchema);

module.exports = User;