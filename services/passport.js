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
        proxy: true
    }, function (accessToken, refreshToken, profile, done) {
        ref.where("googleId", "==", profile.id).get()
            .then(function (snapshot) {
            var id = ref.doc().id;
            var user = {
                googleId: profile.id,
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                picture: profile.photos[0].value,
                id: id
            };
            if (snapshot.empty) {
                ref.doc(id).set(user).then(function () { done(null, user); });
            }
            else {
                snapshot.forEach(function (doc) { done(null, doc.data()); });
            }
        })["catch"](function (err) {
            console.log('Error getting user document.', err);
        });
    }));
};
