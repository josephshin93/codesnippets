"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var keys = require("./config/keys");
var cookieSession = require("cookie-session");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var admin = require("firebase-admin");
var scheduler = require("./services/scheduler");
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
require("./routes/authRoutes")(app, firebase);
require("./routes/usersRoutes")(app, firebase);
require("./routes/snippetRoutes")(app, firebase);
require("./routes/teamRoutes")(app, firebase);
require("./routes/commentRoutes")(app, firebase);
// TODO
// FOR TESTING EMAIL SCHEDULER REMOVE WHEN FINISHED
// var date = new Date;
// var hours = date.getHours();
// var day = date.getDay();
// // Testing emailer/scheduler
// var fakeMember = { "aKJtboKgff9o0CyTzJbY": "Marc Tibbs", "R8vDws3j8PYBzojx3Vzf": "Marc Christopher Tibbs"};
// var fakeRole = { "aKJtboKgff9o0CyTzJbY": "admin", "R8vDws3j8PYBzojx3Vzf": "member" } ;
// var fakeSubs = [
// {
//   title: "FAKE DIGEST",
//   issueTime: hours,  // 0-23
//   issueDay: day,    // 0-7 (Sunday = 0 OR 7)
//   content: "FAKE SUB CONTENT",
//   type: "digest" // "digest" || "reminder"
// },
// {
//   title: "FAKE REMINDER",
//   issueTime: hours,  // 0-23
//   issueDay: day,    // 0-7 (Sunday = 0 OR 7)
//   content: "FAKE SUB CONTENT",
//   type: "reminder" // "digest" || "reminder"
// }
// ];
// var team =  {
//   name: "blue",
//   members: fakeMember,
//   roles: fakeRole,
//   subscriptions: fakeSubs
// }
// scheduler.scheduleSubscriptions(firebase, team);
scheduler.scheduleAllOnStart(firebase);
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    var path_1 = require("path");
    app.get("*", function (req, res) {
        res.sendFile(path_1.resolve(__dirname, "client", "build", "index.html"));
    });
}
var PORT = process.env.PORT || 5000;
app.listen(PORT);
