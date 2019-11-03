import passport from 'passport';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

module.exports = (firebase: any) => {
    
    var ref = firebase.collection('users');

    // TODO
    passport.serializeUser((user: any, done) => {
        console.log("serial", user);
        done(null, user);
    });

    // TODO
    passport.deserializeUser((id, done) => {
        console.log("deserial", id);
        done(null, id);
    })

    passport.use(           
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true,
        }, (accessToken: any, refreshToken: any, profile: any, done: any) => {
            
            ref.where("googleId", "==", profile.id).get()
                .then((snapshot: any) => {
                    if (snapshot.empty) {
                        ref.add({ googleId: profile.id }).then((newUser: any) => {
                            console.log("NEWUSER =>", newUser.id);
                            done(null, newUser);
                        });
                    } else {
                        snapshot.forEach((doc: any) => {
                            console.log("EXISTINGUSER: ", doc.id, '=>', doc.data());
                            done(null, doc.id);
                        });
                    }
                })
                .catch((err: any) => {
                    console.log('Error getting document', err);
                });
        })
    );
}