"use strict";
exports.__esModule = true;
module.exports = function (app, firebase) {
    app.get('/api/snippets', function (req, res) {
        var ref = firebase.collection('snippets').get().then(function (snapshot) {
            res.send(snapshot.docs.map(function (doc) { return doc.data(); }));
        })["catch"](function (err) {
            console.log('Error getting snippets.', err);
        });
    });
};
