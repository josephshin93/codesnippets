"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (app, firebase) {
    // Get list of users in database
    // Usage #1: Populate user names in filter dropdown
    app.get("/api/users", function (req, res) {
        console.log("Route: get /api/users");
        // Reference users collection in database and current team
        // let query = firebase.collection("users");
        var teamSelected = req.query.teamSelected || null;
        // // Handle filter
        // if (teamSelected && teamSelected !== "all") {
        //   console.log("Team selected is " + teamSelected);
        //   query = query.where("teams", "array-contains", teamSelected);
        // }
        // // Retrieve users
        // query
        //   .get()
        //   .then((snapshot: any) => {
        //     res.send(snapshot.docs.map((doc: any) => doc.data()));
        //   })
        //   .catch((err: any) => {
        //     console.log("Error getting users.", err);
        //   });
        // query all users then filter the list of users if necessary
        firebase.collection('users').get()
            .then(function (snapshot) {
            var selectedUsers = snapshot.docs.map(function (doc) {
                return __assign(__assign({}, doc.data()), { id: doc.id });
            });
            // filter list of users for users who are part of the selected team
            if (teamSelected && teamSelected !== 'all') {
                selectedUsers = selectedUsers.filter(function (user) {
                    if (user.teams) {
                        return user.teams.map(function (team) { return team.teamId; }).includes(teamSelected);
                    }
                    else {
                        return false;
                    }
                });
            }
            console.log('users from team', teamSelected, selectedUsers);
            res.send(selectedUsers);
        })
            .catch(function (error) {
            console.error('Error getting users from team with id', teamSelected, error);
        });
    });
};
