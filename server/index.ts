import express from 'express';
import { Request, Response } from 'express';
import passport from 'passport';
import { setPriority } from 'os';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');

const app = express();

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

app.get(
    '/auth/google', 
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

app.get(
    '/auth/google.callback', 
    passport.authenticate('google')
);

app.get(
    '/', 
    (req: Request, res: Response) => {
        res.send({ helloworld: 'test' 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
