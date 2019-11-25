"use strict";
exports.__esModule = true;
var moment = require('moment');
module.exports = function (app, firebase) {
    app.post("/api/add_snippet", function (req, res) {
        console.log("post /api/add_snippet");
        // console.log(req.body);
        var _a = req.body, content = _a.content, description = _a.description, ownerID = _a.ownerID, ownerName = _a.ownerName, status = _a.status, team = _a.team, title = _a.title;
        var snippet = {
            title: title,
            content: content,
            description: description,
            ownerID: ownerID,
            ownerName: ownerName,
            status: status,
            team: team,
            week: moment().format("W"),
            timeCreated: new Date(),
            totalComments: 0,
            totalLikes: 0
        };
        firebase.collection("snippets").add(snippet);
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
            console.log("default week");
            query = query.where("week", "==", "47");
        }
        // Retrieve snippets from database
        query
            .get()
            .then(function (snapshot) {
            res.send(snapshot.docs.map(function (doc) { return doc.data(); }));
        })["catch"](function (err) {
            console.log("Error getting snippets.", err);
        });
    });
};
