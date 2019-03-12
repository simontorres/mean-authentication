var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var config = require('./config/database');

mongoose.Promise = require('bluebird');
mongoose.connect(config.database, { promiseLibrary: require('bluebird')})
    .then(() => console.log('Connection to database succesful'))
    .catch((err) => console.error(err));

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

app.use(morgan('dev'));
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use(express.static(path.join(__dirname, 'public')));
app.use('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


module.exports = app;
