var express = require('express');
var app     = express();
var Course = require('../models/course');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/login");
};

middlewareObj.checkCourseOwnership = function (req,res,next) {
    if(req.isAuthenticated()){
        Course.findById(req.params.id, function (err, foundCourse) {
            if(err) {
                req.flash("error", "Course not found");
                res.redirect("back");
            }else{
                if(foundCourse.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please log in first");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req,res,next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if(err) {
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.send("You do not have permission to do that");
                }
            }
        });
    }else{
        res.redirect("back");
    }
};

module.exports = middlewareObj;