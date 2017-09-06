var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true
    },
    password: String,
    created_on:{
        type:Date,
        default: Date.now
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);