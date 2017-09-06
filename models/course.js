var mongoose = require("mongoose");
var Comment = require("./comment");

var courseSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    instructor: String,
    created_at:{
        type:Date,
        default:Date.now
    },
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Course", courseSchema);