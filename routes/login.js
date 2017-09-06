var express = require('express');
var Router = express.Router({mergeParams:true});
var passport = require('passport');

Router.get("/", function (req,res) {
    res.render("registration/login");
});

Router.post("/", passport.authenticate("local", {
    successRedirect:"/courses",
    failureRedirect:"/login"
}), function (req,res) {});

module.exports = Router;