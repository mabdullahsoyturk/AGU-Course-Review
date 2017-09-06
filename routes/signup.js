var express = require('express');
var Router = express.Router({mergeParams:true});
var User = require('../models/user');
var passport = require('passport');

Router.get("/", function (req,res) {
    res.render("registration/signup");
});

Router.post("/", function (req,res) {
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function (err,user) {
        if(err){
            req.flash("error", err.message);
            return res.redirect("signup");
        }
        passport.authenticate("local")(req,res,function () {
            req.flash("success", "Welcome to AGU Couse Review");
            res.redirect("/courses");
        });
    });
});

module.exports = Router;