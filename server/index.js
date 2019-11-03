"use strict";
var express = require('express');
var keys = require('./config/keys');
var app = express();
var passport = require('passport');
var admin = require('firebase-admin');
var serviceAccount = require('./config/service-account.json');
console.log("type: ", keys.type);
console.log("project_id: ", keys.project_id);
console.log("private_key_id: ", keys.private_key_id);
console.log("private_key: ", keys.private_key);
console.log("client_email: ", keys.client_email);
console.log("client_id: ", keys.client_id);
console.log("auth_uri: ", keys.auth_uri);
console.log("token_uri: ", keys.token_uri);
console.log("auth_provider_x509_cert_url: ", keys.auth_provider_x509_cert_url);
console.log("client_x509_cert_url: ", keys.client_x509_cert_url);
admin.initializeApp({
    credential: admin.credential.cert({
        type: keys.type,
        project_id: keys.project_id,
        private_key_id: keys.private_key_id,
        private_key: keys.private_key,
        client_email: keys.client_email,
        client_id: keys.client_id,
        auth_uri: keys.auth_uri,
        token_uri: keys.token_uri,
        auth_provider_x509_cert_url: keys.auth_provider_x509_cert_url,
        client_x509_cert_url: keys.client_x509_cert_url,
    }),
    databaseURL: keys.databaseURL
});
var firebase = admin.firestore();
require('./services/passport')(firebase);
app.use(passport.initialize());
app.use(passport.session());
require('./routes/authRoutes')(app);
var PORT = process.env.PORT || 5000;
app.listen(PORT);
