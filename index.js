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
app.use(
  cookieSession({
    maxAge: 15 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
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
// Testing emailer/scheduler
var fakeMember = { "FAKE USER ID": "FAKE USER NAME" };
var fakeRole = { "FAKE USER ID": "admin" };
var fakeSubs = [
  {
    title: "FAKE SUB TITLE",
    issueTime: 18,
    issueDay: 6,
    content: "FAKE SUB CONTENT"
  }
];
var team = {
  name: "FAKE TEAM",
  members: fakeMember,
  roles: fakeRole,
  subscriptions: fakeSubs
};
var sub = "sub";
require("./services/scheduler")(firebase, team);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  var path_1 = require("path");
  app.get("*", function(req, res) {
    res.sendFile(path_1.resolve(__dirname, "client", "build", "index.html"));
  });
}
var PORT = process.env.PORT || 5000;
app.listen(PORT);
