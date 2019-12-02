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
module.exports = function (app, firebase) {
    app.get("/api/comments", function (req, res) {
        console.log("Route: GET /api/comments");
        // Setup query variables
        var snippetId = req.query.id;
        var query = firebase
            .collection("snippets")
            .doc(snippetId)
            .collection("comments")
            .orderBy("timeCreated");
        // Retrieve comments from database
        query
            .get()
            .then(function (snapshot) {
            res.send(snapshot.docs.map(function (doc) {
                return __assign(__assign({}, doc.data()), { id: doc.id });
            }));
        })["catch"](function (err) {
            console.log("Error getting comments", err);
        });
    });
    // Add a comment
    app.post("/api/add_comment", function (req, res) {
        var user = req.user;
        if (!user) {
            res.send({});
        }
        else {
            var snippetId = req.body.snippetId;
            var thisComment = {
                comment: req.body.comment,
                timeCreated: new Date(),
                googleId: user.googleId,
                userPicture: user.picture,
                userFirstName: user.firstName,
                userLastName: user.lastName
            };
            firebase
                .collection("snippets")
                .doc(snippetId)
                .collection("comments")
                .add(thisComment);
        }
    });
    // Delete a comment
    app["delete"]("/api/delete_comment", function (req, res) {
        var user = req.user;
        if (!user) {
            res.send({});
        }
        else {
            // Setup query variables
            var thisSnippet = req.query.snippetId;
            var thisComment = req.query.commentId;
            // Setup query
            var query = firebase
                .collection("snippets")
                .doc(thisSnippet)
                .collection("comments")
                .doc(thisComment);
            // Delete comment from database
            query["delete"]()["catch"](function (err) {
                console.log("Error deleting comment", err);
            });
        }
    });
};
