import passport from 'passport';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');


module.exports = (firebase: any) => {
    
    var ref = firebase.database().ref().child('users');

    // TODO
    passport.serializeUser((user: any, done) => {
        done(null, user.googleId);
    });

    // TODO
    passport.deserializeUser((id, done) => {
        ref.orderByChild("googleId").equalTo(id).once("value", function(snapshot: any) {
            // TODO: There's gotta be a better way to access property
            for (var id in snapshot.val()) { 
                console.log(snapshot.val()[id]);
                done(null, snapshot.val()[id]);
            }
        }, function (err: any) { console.log(err.code); });
    })

    passport.use(           
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true,
        }, (accessToken: any, refreshToken: any, profile: any, done: any) => {
            
            console.log(profile);

            ref.on('child_added', function(snapshot: any) { done(null, snapshot.val()); });

            // TODO: 
            // Consider adding ".indexOn": "googleId" at /users to your security rules for better performance.
            ref.orderByChild("googleId").equalTo(profile.id).once("value", function(snapshot: any) {

                if ( !snapshot.exists() ) {
                    ref.push().set({ googleId: profile.id });
                } else {                   
                    // TODO: There's gotta be a better way to access property
                    for (var id in snapshot.val()) { 
                        done(null, snapshot.val()[id]);
                    }
                }
            }, function (err: any) { console.log(err.code); });
        })
    );
}