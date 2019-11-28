"use strict";
exports.__esModule = true;
var express = require("express");
var keys = require("./config/keys");
var cookieSession = require("cookie-session");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var admin = require("firebase-admin");
app.use(bodyParser.json());
app.use(cookieSession({
    maxAge: 15 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}));
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
        client_x509_cert_url: keys.client_x509_cert_url
    }),
    databaseURL: keys.databaseURL
});
var firebase = admin.firestore();
require("./services/passport")(firebase);
app.use(passport.initialize());
app.use(passport.session());
require("./routes/authRoutes")(app);
require("./routes/usersRoutes")(app, firebase);
require("./routes/snippetRoutes")(app, firebase);
require("./routes/teamRoutes")(app, firebase);
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    var path_1 = require("path");
    app.get("*", function (req, res) {
        res.sendFile(path_1.resolve(__dirname, "client", "build", "index.html"));
    });
}
var PORT = process.env.PORT || 5000;
app.listen(PORT);
