const express = require('express');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const admin = require('firebase-admin');
const scheduler = require('./services/scheduler');
import { Request, Response } from 'express';
import { Subscription, Team, TeamMember } from './types';

app.use(bodyParser.json());
app.use(
  cookieSession({
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
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
    client_x509_cert_url: keys.client_x509_cert_url,
  }),
  databaseURL: keys.databaseURL
});

let firebase = admin.firestore();

require('./services/passport')(firebase);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app, firebase);
require('./routes/snippetRoutes')(app, firebase);
require('./routes/teamRoutes')(app, firebase);

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


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
