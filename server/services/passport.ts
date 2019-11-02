import passport from 'passport';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/key.js');

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, (accessToken: any, refreshToken: any, profile: any, done: any) => {
        console.log('access:', accessToken);
        console.log('refresh', refreshToken);
        console.log('profile:', profile);
    })
);