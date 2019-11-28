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
            .collection("comments");
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
};
