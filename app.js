var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    User = require('./models/user'),
    login = require('./routes/login'),
    signup = require('./routes/signup'),
    logout = require('./routes/logout'),
    courses = require('./routes/courses'),
    comments = require('./routes/comments');

app.set('port', process.env.PORT || 3000);
//mongoose.connect("mongodb://localhost/yelpcamp2");
mongoose.connect("mongodb://muhammet:deneme@ds127854.mlab.com:27854/agu_course_review");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.locals.moment = require('moment');

app.use(require("express-session")({
    secret: "Wow wow wow",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

///////////////////////////////////////PASSPORT CONFIG//////////////////////////////////////////////////////////////////
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(function (req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get("/", function (req,res) {
    res.render("landing");
});

app.use("/courses", courses);
app.use("/courses/:id/comments", comments);

app.use("/signup", signup);

app.use("/login", login);

app.use("/logout", logout);

app.listen(3000);