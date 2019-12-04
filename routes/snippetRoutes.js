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
exports.__esModule = true;
var moment = require("moment");
module.exports = function (app, firebase) {
    app.post("/api/add_snippet", function (req, res) {
        // Add snippet only if they're the user
        var user = req.user;
        if (!user) {
            res.send({});
        }
        else {
            // Make snippet object
            var snippet = {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                team: req.body.team,
                content: req.body.content,
                ownerId: user.googleId,
                ownerFirstName: user.firstName,
                ownerLastName: user.lastName,
                ownerPicture: user.picture,
                week: moment().format("W"),
                timeCreated: new Date(),
                totalComments: 0,
                totalLikes: 0
            };
            // Add snippet to database
            firebase.collection("snippets").add(snippet);
        }
    });
    app.get("/api/snippets", function (req, res) {
        console.log("Route: GET /api/snippets");
        // Setup query then filters if they exist
        var query = firebase.collection("snippets");
        var teamSelected = req.query.teamSelected || null;
        var userSelected = req.query.userSelected || null;
        var weekSelected = req.query.weekSelected || null;
        // Append filters for team, user, and/or week
        // Otherwise, query all snippets for current week
        if (teamSelected) {
            console.log(teamSelected);
            query = query.where("team", "==", teamSelected);
        }
        if (userSelected) {
            console.log(userSelected);
            query = query.where("ownerID", "==", userSelected);
        }
        if (weekSelected) {
            console.log(weekSelected);
            query = query.where("week", "==", weekSelected);
        }
        else {
            console.log("default week = " + moment().format("W"));
            query = query.where("week", "==", moment().format("W"));
        }
        // Retrieve snippets from database
        query
            .get()
            .then(function (snapshot) {
            res.send(snapshot.docs.map(function (doc) {
                return __assign(__assign({}, doc.data()), { id: doc.id });
            }));
        })["catch"](function (err) {
            console.log("Error getting snippets.", err);
        });
    });
    // Get single snippet
    app.get("/api/snippet", function (req, res) {
        console.log("Route: GET api/snippet");
        // Setup query variables
        var query = firebase.collection("snippets");
        var snippetID = req.query.id;
        // Retrieve snippet from database
        query
            .doc(snippetID)
            .get()
            .then(function (doc) {
            res.send(doc.data());
        })["catch"](function (err) {
            console.log("Error getting snippet", err);
        });
    });
};
