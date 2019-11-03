# Code Snippet / Boba: Server


## Commit History and Notes
- A simple log tracking the significant changes made to the server


### Commit 5be5788  - Hooked up server with client
Added new routes to handle user login and logging out. Also added production build logic for when the app is deployed to Heroku.


### Commit 9850292 - Added Cookie Session

Added cookies to our app to remember our users, so that they do not need to sign into the app every time they navigate to our site. Cookies are set to last for 15 days at the moment.

### Commit 16f37c3 - Change from Firestore JSON creds to variables in key file

In order to deploy from Heroku we are going to have to have Heroku pass keys to our app because we don't want to store a JSON file with sensitive information on our repo. 

### Commit 5d30e54 - Change from Firebase DB to Firestore

Updated the server to use Firestore instead of the Firebase DB. 

### Commit 54db7de - User Auth Flow

Implemented user flow, so that when a new user signs in, we create a new user account. Otherwise, we sign the user back in with their previously assigned account. 

### Commit 4483abf - Setting up OAuth
Updated index.ts with routes for Google Auth

Added keys.js file for Google Auth API

Added node modules:
    - nodemon
    - passport

Comments:
I enabled the Google API by creating a new project under the Google developer console. Using the id and secret from this new project, we can now use Google Authentication on our project. Also installed the 'passport' node module that will help make authenticating with Google easier. Navigating to `localhost:5000/auth/google` will bring up the Google Auth screen.

Also, installed the "nodemon" package to make developing the server easier. Added a script to start the server with nodemon: `npm run dev`.


### Commit 03e598c - Init
10/31/2019 @ 15:03

Added Server directory

Added index.ts file & compiled to index.js

Added node modules:
    - express
    - node
    - types/express (typescript)
    - types/node (typescript)
    - typescript

Comments:
At this point I'm just setting up a basic server to get started from. I'm following the same steps I used to create a test app for this project. However, I am adding the use of typescript this time around. You can run `node index.js` to run the test server which will run on `localhost:5000` and display a simple message. 