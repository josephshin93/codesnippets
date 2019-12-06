"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
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
        var weekSelected = req.query.weekSelected || moment().format('W');
        // Append filters for user and/or week
        if (userSelected) {
            console.log(userSelected);
            query = query.where("ownerID", "==", userSelected);
        }
        query = query.where('week', '==', weekSelected);
        // FIXME: should probably use an HTTP error code
        if (!req.user)
            res.send({});
        var user = req.user;
        // query for snippets
        console.log('Route: GET /api/snippets', '->', 'querying for snippets of week', weekSelected, ' and owner', userSelected);
        query.get()
            .then(function (snapshot) {
            var snippets = snapshot.docs.map(function (doc) { return doc.data(); });
            // console.log(snippets);
            if (!teamSelected || teamSelected === '') {
                // query for current user in order to get the list of teams
                console.log('Route: GET /api/snippets', '->', 'querying for user', user.id);
                firebase.collection('users').doc(user.id).get()
                    .then(function (doc) {
                    var userTeams = doc.data().teams;
                    // console.log(doc.data());
                    // send snippets only from teams that the user is a part of
                    res.send(snippets.filter(function (snippet) { return userTeams.includes(snippet.team); }));
                })
                    .catch(function (error) {
                    console.error('Error getting user ' + user.id + ' teams in getting snippet list', error);
                });
            }
            else {
                // send snippets only from selected team
                res.send(snippets.filter(function (snippet) { return snippet.team == teamSelected; }));
            }
        })
            .catch(function (error) {
            console.error('Error getting snippets of week \'' + weekSelected + '\'', error);
        });
    });
};
