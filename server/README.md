# Code Snippet / Boba: Server


## Commit History and Notes
- A simple log tracking the significant changes made to the server


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