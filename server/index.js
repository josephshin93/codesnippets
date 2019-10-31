"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var keys = require('./config/keys');
var app = express_1.default();
passport_1.default.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
}, function (accessToken, refreshToken, profile, done) {
    console.log('access:', accessToken);
    console.log('refresh', refreshToken);
    console.log('profile:', profile);
}));
app.get('/auth/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email']
}));
app.get('/auth/google.callback', passport_1.default.authenticate('google'));
app.get('/', function (req, res) {
    res.send({ helloworld: 'test'
    });
});
var PORT = process.env.PORT || 5000;
app.listen(PORT);
