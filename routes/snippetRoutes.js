"use strict";
exports.__esModule = true;
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
            timeCreated: new Date(),
            totalComments: 0,
            totalLikes: 0
        };
        firebase.collection("snippets").add(snippet);
    });
    app.get("/api/snippets", function (req, res) {
        console.log("Route: GET /api/snippets");
        //const { teamSelected, userSelected, weekSelected } = req.query;
        //console.log(
        //  "Params: " + teamSelected + " " + userSelected + " " + weekSelected
        //);
        var teamSelected = req.query.teamSelected || null;
        var userSelected = req.query.userSelected || null;
        var weekSelected = req.query.weekSelected || null;
        // Test filter logic
        var query = firebase.collection("snippets");
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
        // Get query
        /* FIXME: implement snippet query parameters (by team, by user, etc)
        firebase
          .collection("snippets")
          .where("week", "==", weekSelected)
          */
        query
            .get()
            .then(function (snapshot) {
            // snapshot.docs.forEach((doc: any) => {
            //   console.log(doc.id, doc.data());
            // });
            res.send(snapshot.docs.map(function (doc) { return doc.data(); }));
            // res.send(dummydata.snippets);
        })["catch"](function (err) {
            console.log("Error getting snippets.", err);
        });
    });
};
