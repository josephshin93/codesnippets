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
var FieldValue = require("firebase-admin").firestore.FieldValue;
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
                content: req.body.content,
                ownerID: user.googleId,
                ownerFirstName: user.firstName,
                ownerLastName: user.lastName,
                ownerPicture: user.picture,
                week: moment().format("W"),
                timeCreated: new Date(),
                totalComments: 0,
                totalLikes: 0
            };
            if (req.body.team)
                snippet.team = req.body.team;
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
        var weekSelected = req.query.weekSelected || moment().format("W");
        // Append filters for user and/or week
        if (userSelected) {
            console.log("user selected: ", userSelected);
            query = query.where("ownerID", "==", userSelected);
        }
        query = query.where("week", "==", weekSelected);
        // FIXME: should probably use an HTTP error code
        if (!req.user)
            res.send({});
        var user = req.user;
        // query for snippets
        console.log("Route: GET /api/snippets", "->", "querying for snippets of week", weekSelected, "and owner", userSelected, "and team", teamSelected);
        query
            .get()
            .then(function (snapshot) {
            var snippets = snapshot.docs.map(function (doc) {
                return __assign(__assign({}, doc.data()), { id: doc.id });
            });
            // console.log(snippets);
            if (!teamSelected || teamSelected === "") {
                // query for current user in order to get the list of teams
                console.log("Route: GET /api/snippets", "->", "querying for user", user.id);
                firebase
                    .collection("users")
                    .doc(user.id)
                    .get()
                    .then(function (doc) {
                    var userTeams = doc
                        .data()
                        .teams.map(function (team) { return team.teamId; });
                    userTeams.push("");
                    // console.log(doc.data());
                    // send snippets only from teams that the user is a part of
                    res.send(snippets.filter(function (snippet) {
                        return (!snippet.team || userTeams.includes(snippet.team.teamId));
                    }));
                })["catch"](function (error) {
                    console.error("Error getting user " +
                        user.id +
                        " teams in getting snippet list", error);
                });
            }
            else if (teamSelected === "personal") {
                /**
                 * send snippets that current user created but does not belong to team
                 *   this is the current definition of personal snippets
                 */
                var personalSnippets = snippets.filter(function (snippet) {
                    // console.log(snippet.title, snippet.ownerID, snippet.team);
                    return snippet.ownerID === user.googleId && !snippet.team;
                });
                // console.log('personal snippets', personalSnippets);
                res.send(personalSnippets);
            }
            else {
                // send snippets only from selected team
                res.send(snippets.filter(function (snippet) {
                    return snippet.team && snippet.team.teamId == teamSelected;
                }));
            }
        })["catch"](function (error) {
            console.error("Error getting snippets of week '" + weekSelected + "'", error);
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
    // Like a snippet
    app.put("/api/like_snippet", function (req, res) {
        // Like snippet only if they're the user
        var user = req.user;
        // https://stackoverflow.com/questions/47091940/fieldvalue-undefined-when-using-functions-and-firestore
        var increment = FieldValue.increment(1);
        if (!user) {
            res.send({});
        }
        else {
            // Reference the snippets
            var query_1 = firebase.collection("snippets").doc(req.body.id);
            var snippetId = req.body.id;
            console.log("Route snippet id ", snippetId);
            // Update the count
            query_1.update({ totalLikes: increment }).then(function (doc) {
                // Add the user to likes array
                query_1
                    .update({ likes: FieldValue.arrayUnion(user.googleId) })["catch"](function (err) {
                    console.error("Error updating likes", err);
                });
            });
        }
    });
    // Dislike a snippet
    app.put("/api/dislike_snippet", function (req, res) {
        // Like snippet only if they're the user
        var user = req.user;
        // https://stackoverflow.com/questions/47091940/fieldvalue-undefined-when-using-functions-and-firestore
        var decrement = FieldValue.increment(-1);
        if (!user) {
            res.send({});
        }
        else {
            // Reference the snippets
            var query_2 = firebase.collection("snippets").doc(req.body.id);
            var snippetId = req.body.id;
            console.log("Route snippet id ", snippetId);
            // Update the count
            query_2.update({ totalLikes: decrement }).then(function (doc) {
                // Remove the user from likes array
                query_2
                    .update({ likes: FieldValue.arrayRemove(user.googleId) })["catch"](function (err) {
                    console.error("Error updating dislikes", err);
                });
            });
        }
    });
};
