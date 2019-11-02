"use strict";
var express = require('express');
var app = express();
var passport = require('passport');
var firebase = require('firebase').initializeApp({
    serviceAccount: './config/service-account.json',
    databaseURL: "https://boba-cf267.firebaseio.com"
});
require('./services/passport')(firebase);
app.use(passport.initialize());
app.use(passport.session());
require('./routes/authRoutes')(app);
var PORT = process.env.PORT || 5000;
app.listen(PORT);
