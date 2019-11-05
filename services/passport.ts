const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

module.exports = (firebase: any) => {
    
    var ref = firebase.collection('users');

    passport.serializeUser((user: any, done: any) => { done(null, user);});

    passport.deserializeUser((id: any, done: any) => { done(null, id);});

    passport.use(           
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true,
        }, (accessToken: any, refreshToken: any, profile: any, done: any) => {
            ref.where("googleId", "==", profile.id).get()
                .then((snapshot: any) => {
                    var user = { 
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        picture: profile.photos[0].value
                    };

                    if (snapshot.empty) {
                        ref.add(user).then( () => { done(null, user) });
                    } else {
                        snapshot.forEach( (doc: any) => { done(null, doc.data()) });
                    }
                })
                .catch((err: any) => {
                    console.log('Error getting user document.', err);
                });
        })
    );
}