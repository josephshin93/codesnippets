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
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var keys = require('../config/keys');
module.exports = function (firebase) {
    var ref = firebase.collection('users');
    passport.serializeUser(function (user, done) { done(null, user); });
    passport.deserializeUser(function (id, done) { done(null, id); });
    passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true,
    }, function (accessToken, refreshToken, profile, done) {
        ref.where("googleId", "==", profile.id).get()
            .then(function (snapshot) {
            var user = {
                googleId: profile.id,
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                picture: profile.photos[0].value
            };
            if (snapshot.empty) {
                ref.add(user).then(function () { done(null, user); });
            }
            else {
                snapshot.forEach(function (doc) {
                    // console.log('passport, user docs', doc.id, doc.data());
                    // add in id to user data
                    var userData = __assign({ id: doc.id }, doc.data());
                    done(null, userData);
                });
            }
        })
            .catch(function (err) {
            console.log('Error getting user document.', err);
        });
    }));
};
