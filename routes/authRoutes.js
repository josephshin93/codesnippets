"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require('passport');
module.exports = function (app, firebase) {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
    app.get('/auth/google/callback', passport.authenticate('google'), function (req, res) {
        // console.log('get /auth/google/callback');
        // console.log('req.user', req.user);
        res.redirect('/?token=' + JSON.stringify(req.user));
    });
    app.get('/api/logout', function (req, res) {
        req.logout();
        res.redirect('/?logout=true');
    });
    app.get('/api/current_user', function (req, res) {
        // retrieve user from database and send it to user
        var user = req.user;
        firebase.collection('users').doc(user.id).get()
            .then(function (doc) {
            res.send(__assign({ id: doc.id }, doc.data()));
        })
            .catch(function (error) {
            console.error('Error retrieving current user', error);
        });
    });
    app.get('/api/all_users', function (req, res) {
        console.log('get /api/all_users');
        // retrieve all users from database
        firebase.collection('users').get()
            .then(function (snapshot) {
            var allUsers = [];
            snapshot.forEach(function (doc) {
                allUsers.push(__assign({ id: doc.id }, doc.data()));
            });
            res.send(allUsers);
        })
            .catch(function (error) {
            console.error('Error retrieving all users', error);
        });
    });
};
