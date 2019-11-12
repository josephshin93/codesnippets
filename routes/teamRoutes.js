"use strict";
exports.__esModule = true;
module.exports = function (app, firebase) {
    app.post("/api/add_team", function (req, res) {
        console.log(req.body);
        var _a = req.body, name = _a.name, members = _a.members, roles = _a.roles;
        var team = {
            // title,
            // content,
            // description,
            // ownerID,
            // ownerName,
            // status,
            // team,
            // timeCreated: new Date(),
            // totalComments: 0,
            // totalLikes: 0
            name: name,
            members: members,
            roles: roles
        };
        firebase.collection("teams").add(team);
    });
    app.get("/api/teams", function (req, res) {
        firebase
            .collection("teams")
            .get()
            .then(function (snapshot) {
            res.send(snapshot.docs.map(function (doc) { return doc.data(); }));
        })["catch"](function (err) {
            console.log("Error getting teams.", err);
        });
    });
};
