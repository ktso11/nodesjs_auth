var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    methodOverride = require('method-override')

var db = require("./models"),
    User = db.User

// Configure app
app.set("views", __dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(cookieParser());
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Passport Configure
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set CORS Headers
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ROUTES
app.get('/', function(req, res) {
 res.render("index", { user: req.user, });
});

app.get('/signup', function(req, res) {
 res.render('signup');
});

app.get('/login', function (req, res) {
 res.render('login');
});



app.post('/signup', function (req, res) {
  User.register(new User({
    username: req.body.username }),
    req.body.password,
    function (err, newUser) {
      passport.authenticate('local')(req, res, function() {
        console.log(err);
        res.send('signed up!!!');
      });
    }
  );
});

app.post('/login', passport.authenticate('local'), function (req, res) {
  console.log(req.user);
  res.redirect('/');
});

app.get('/logout', function (req, res) {
  console.log("BEFORE logout", JSON.stringify(req.user));
  req.logout();
  console.log("AFTER logout", JSON.stringify(req.user));
  res.redirect('/');
});


app.listen(process.env.PORT || 3400, function () {
  console.log('Example app listening at http://localhost:3400/');
});
