const express = require('express');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const app = express();
const passport = require('passport');
const admin = require('firebase-admin');
import { Request, Response } from 'express';

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

require('./routes/authRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
