const express = require('express');

const app = express();
const passport = require('passport');

const admin = require('firebase-admin');

let serviceAccount = require('./config/service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let firebase = admin.firestore();

require('./services/passport')(firebase);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
