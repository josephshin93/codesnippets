"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var keys = require('../config/keys');
module.exports = function (firebase) {
    var ref = firebase.collection('users');
    // TODO
    passport_1.default.serializeUser(function (user, done) {
        console.log("serial", user);
        done(null, user);
    });
    // TODO
    passport_1.default.deserializeUser(function (id, done) {
        console.log("deserial", id);
        done(null, id);
    });
    passport_1.default.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true,
    }, function (accessToken, refreshToken, profile, done) {
        ref.where("googleId", "==", profile.id).get()
            .then(function (snapshot) {
            if (snapshot.empty) {
                ref.add({ googleId: profile.id }).then(function (newUser) {
                    console.log("NEWUSER =>", newUser.id);
                    done(null, newUser);
                });
            }
            else {
                snapshot.forEach(function (doc) {
                    console.log("EXISTINGUSER: ", doc.id, '=>', doc.data());
                    done(null, doc.id);
                });
            }
        })
            .catch(function (err) {
            console.log('Error getting document', err);
        });
    }));
};
