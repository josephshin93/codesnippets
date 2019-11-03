# Code Snippet / Boba: Client


## Commit History and Notes
- A simple log tracking the significant changes made to the client


### Commit 5be5788 - Created client

Added a React app with Typescript using `npx create-react-app client --typescript`. Added `http-proxy-middleware` to make it easier to develop on localhost.

**Axios**
Added axios to make request to the server. Added a `FETCH_USER` action to get user data and we use this to  check user login status. 

**Reducers**
Also setup a reducer using Redux to help handle and track the application's state.

**Components**
Added components `App`, `Dashboard`, `Landing`, and `Header` as a basic foundation for the app. Using these components we can setup the first few pages needed for our app. 