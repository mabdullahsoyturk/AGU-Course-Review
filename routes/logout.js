var express = require('express');
var Router = express.Router({mergeParams:true});

Router.get("/logout", function (req,res) {
    req.logout();
    req.flash("success", "You logged out");
    res.redirect("/courses");
});

module.exports = Router;