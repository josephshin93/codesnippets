"use strict";
exports.__esModule = true;
module.exports = function (app, firebase) {
    //   app.post("/api/add_snippet", (req: Request, res: Response) => {
    //     console.log(req.body);
    //     const {
    //       content,
    //       description,
    //       ownerID,
    //       ownerName,
    //       status,
    //       team,
    //       title
    //     } = req.body;
    //     const snippet = {
    //       title,
    //       content,
    //       description,
    //       ownerID,
    //       ownerName,
    //       status,
    //       team,
    //       timeCreated: new Date(),
    //       totalComments: 0,
    //       totalLikes: 0
    //     };
    //     firebase.collection("snippets").add(snippet);
    //   });
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
