var express = require('express');
var Router = express.Router({mergeParams:true});
var Course = require('../models/course');
var Middleware = require('../middlewares/auth');

Router.get("/", function (req,res) {
    Course.find({}, function (err, allCourses) {
        if(err){
            res.send("Error in backend");
        }else{
            res.render("courses/index", {courses:allCourses, currentUser:req.user});
        }
    });
});

Router.post("/", Middleware.isLoggedIn, function (req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var instructor = req.body.instructor;
    var author = {
            id: req.user._id,
            username:req.user.username
    };
    var newCourse =  {name:name, image:image, description:description, instructor:instructor, author: author};

    Course.create(newCourse, function (err, newlyCreated) {
        if(err){
            res.send("Error in backend");
        }else{
            res.redirect("/courses");
        }
    });
});

Router.get("/new", Middleware.isLoggedIn, function (req,res) {
    res.render("courses/new");
});

Router.get("/:id", function (req,res) {
    Course.findById(req.params.id).populate("comments").exec(function (err,foundCourse) {
        if(err){
            res.send("Error in backend");
        }else{
            res.render("courses/show", {course:foundCourse});
        }
    });
});

Router.get("/:id/edit", Middleware.checkCourseOwnership, function (req,res) {
    Course.findById(req.params.id, function (err, foundCourse) {
        res.render("courses/edit", {course: foundCourse});
    });
});

Router.put("/:id", Middleware.checkCourseOwnership, function (req,res) {
    var data = {name: req.body.name, image:req.body.image, description:req.body.description};
    Course.findByIdAndUpdate(req.params.id, data, function (err, updatedCourse) {
        if(err){
            res.redirect("/courses");
        }else{
            req.flash('success', 'The course has been edited');
            res.redirect("/courses/" + req.params.id);
        }
    });
});

Router.delete("/:id", Middleware.checkCourseOwnership,  function (req,res) {
    Course.findByIdAndRemove(req.params.id, function (err) {
        if(err){
            res.redirect("/courses");
        }else{
            req.flash('success', 'The course has been deleted');
            res.redirect("/courses");
        }
    })
});

module.exports = Router;