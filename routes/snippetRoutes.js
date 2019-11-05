"use strict";
exports.__esModule = true;
module.exports = function (app, firebase) {
    app.post("/api/add_snippet", function (req, res) {
        console.log(req.body);
        var _a = req.body, content = _a.content, description = _a.description, ownerID = _a.ownerID, ownerName = _a.ownerName, status = _a.status, team = _a.team, title = _a.title;
        var snippet = {
            title: title,
            content: content,
            description: description,
            ownerID: ownerID,
            ownerName: ownerName,
            status: status,
            team: team,
            timeCreated: new Date(),
            totalComments: 0,
            totalLikes: 0
        };
        firebase.collection("snippets").add(snippet);
    });
    app.get("/api/snippets", function (req, res) {
        firebase
            .collection("snippets")
            .orderBy("timeCreated", "desc")
            .get()
            .then(function (snapshot) {
            res.send(snapshot.docs.map(function (doc) { return doc.data(); }));
        })["catch"](function (err) {
            console.log("Error getting snippets.", err);
        });
    });
};
