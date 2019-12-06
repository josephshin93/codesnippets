"use strict";
exports.__esModule = true;
module.exports = function (app, firebase) {
    // Get list of users in database
    // Usage #1: Populate user names in filter dropdown
    app.get("/api/users", function (req, res) {
        console.log("Route: get /api/users");
        // Reference users collection in database and current team
        var query = firebase.collection("users");
        var teamSelected = req.query.teamSelected || null;
        // Handle filter
        if (teamSelected && teamSelected !== "all") {
            console.log("Team selected is " + teamSelected);
            query = query.where("teams", "array-contains", teamSelected);
        }
        // Retrieve users
        query
            .get()
            .then(function (snapshot) {
            res.send(snapshot.docs.map(function (doc) { return doc.data(); }));
        })["catch"](function (err) {
            console.log("Error getting users.", err);
        });
    });
};
