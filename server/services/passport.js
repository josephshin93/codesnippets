"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var keys = require('../config/keys');
module.exports = function (firebase) {
    var ref = firebase.database().ref().child('users');
    // TODO
    passport_1.default.serializeUser(function (user, done) {
        done(null, user.googleId);
    });
    // TODO
    passport_1.default.deserializeUser(function (id, done) {
        ref.orderByChild("googleId").equalTo(id).once("value", function (snapshot) {
            // TODO: There's gotta be a better way to access property
            for (var id in snapshot.val()) {
                console.log(snapshot.val()[id]);
                done(null, snapshot.val()[id]);
            }
        }, function (err) { console.log(err.code); });
    });
    passport_1.default.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true,
    }, function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        ref.on('child_added', function (snapshot) { done(null, snapshot.val()); });
        // TODO: 
        // Consider adding ".indexOn": "googleId" at /users to your security rules for better performance.
        ref.orderByChild("googleId").equalTo(profile.id).once("value", function (snapshot) {
            if (!snapshot.exists()) {
                ref.push().set({ googleId: profile.id });
            }
            else {
                // TODO: There's gotta be a better way to access property
                for (var id in snapshot.val()) {
                    done(null, snapshot.val()[id]);
                }
            }
        }, function (err) { console.log(err.code); });
    }));
};
