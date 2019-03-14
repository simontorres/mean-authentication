var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var User = require('../models/User');
var Book = require('../models/Book');

/* GET home page */
router.get('/', function (req, res, next) {
    res.send('Express RESTful API')
});


router.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password.'});
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exist.'})
            }
            res.json({success: true, msg: 'Successful created new user.'})
        });
    }
});

router.post('/signin', function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), config.secret);
                    // return the information incluiding token as json
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});


router.get('/test', passport.authenticate('jwt', {session: false}), function(req, res) {
    res.json({sucess: true});
});


router.post('/books', passport.authenticate('jwt', { session: false }), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var newBook = new Book({
            isbn: req.body.isbn,
            title: req.body.title,
            author: req.body.author,
            publisher: req.body.publisher
        });

        newBook.save(function (err) {
            if (err) {
                return res.json({success: false, msg: 'Save book failed'});
            }
            res.json({success: true, msg: 'Successful created new book'});
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized access.'});
    }
});


router.get('/books', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        console.log(token);
        Book.find(function (err, books) {
            if (err) {
                console.log(err);
                return next(err);
            } else if (books.length > 0) {
                res.json({success: true, books: books, msg: 'Found ' + books.length + ' books'});
            } else {
                res.json({success: false, msg: 'There is no record of books'});
            }

        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized access.'})
    }
});


getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;
