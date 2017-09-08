var express = require('express');
var Router = express.Router({mergeParams:true});
var Middleware = require('../middlewares/auth');
var Course = require('../models/course');
var Comment = require('../models/comment');

///////////////////////////////////////CREATE///////////////////////////////////////////////////////////////////////////

Router.post("/", Middleware.isLoggedIn, function (req,res) {
    Course.findById(req.params.id, function (err, course) {
        if(err){
            console.log(err);
            res.redirect("/courses");
        }else{

            var text = req.body.text;
            var newComment = {text:text};

            Comment.create(newComment, function (err,comment) {
                if(err){
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    course.comments.push(comment);
                    course.save();
                    req.flash("success", "Your comment successfully created");
                    res.redirect("/courses/" + course._id);
                }
            })
        }
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Router.get("/new", Middleware.isLoggedIn, function (req,res) {
    Course.findById(req.params.id, function (err, course) {
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {course:course});
        }
    });
});

Router.get("/:comment_id/edit", Middleware.checkCommentOwnership, function (req,res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
       if(err){
           res.redirect("back");
       }else{
           res.render("comments/edit", {course_id: req.params.id, comment: foundComment});
       }
    });
});

//////////////////////////////UPDATE////////////////////////////////////////////////////////////////////////////////////

Router.put("/:comment_id", Middleware.checkCommentOwnership, function (req,res) {
    var editedComment = {text:req.body.text};
   Comment.findByIdAndUpdate(req.params.comment_id, editedComment, function (err, updatedComment) {
       if(err){
           res.redirect("back");
       }else{
           res.redirect("/courses/" + req.params.id);
       }
   });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////DELETE///////////////////////////////////////////////////////////////////////////////////

Router.delete("/:comment_id", Middleware.checkCommentOwnership, function (req,res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if(err){
            res.redirect("/courses/" + req.params.id);
        }else{
            req.flash("success", "Your comment has been deleted");
            res.redirect("/courses/" + req.params.id);
        }
    })
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = Router;
