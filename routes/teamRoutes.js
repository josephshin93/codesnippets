"use strict";
exports.__esModule = true;
module.exports = function (app, firebase) {
    // app.post("/api/add_team", (req: Request, res: Response) => {
    //   console.log(req.body);
    //   const {
    //     content,
    //     description,
    //     ownerID,
    //     ownerName,
    //     status,
    //     team,
    //     title
    //   } = req.body;
    //   const team = {
    //     title,
    //     content,
    //     description,
    //     ownerID,
    //     ownerName,
    //     status,
    //     team,
    //     timeCreated: new Date(),
    //     totalComments: 0,
    //     totalLikes: 0
    //   };
    //   firebase.collection('teams').add(team);
    // });
    app.get("/api/teams", function (req, res) {
        console.log("get /api/teams");
        // console.log(req.user);
        // console.log(req.query);
        var user = req.user;
        if (user && user.teams) {
            /**
             * get document references for all teams
             *   duplicate team ids will result in duplicate results
             *   non-existent team ids will result in a null object
             */
            var teamRefs = user.teams.map(function (teamId) {
                // console.log('making document reference for '+teamId);
                return firebase.collection("teams").doc(teamId);
            });
            firebase
                .getAll.apply(firebase, teamRefs).then(function (docs) {
                var teams = {};
                docs.forEach(function (doc) {
                    // console.log(doc.id, doc.data());
                    teams[doc.id] = doc.data();
                });
                res.send(teams);
            })["catch"](function (err) {
                console.log("Error getting teams.", err);
            });
        }
        else {
            res.send({});
        }
    });
};
