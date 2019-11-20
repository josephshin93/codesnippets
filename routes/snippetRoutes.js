"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (app, firebase) {
    app.post('/api/add_snippet', function (req, res) {
        console.log('/api/add_snippet');
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
        firebase.collection('snippets').add(snippet);
    });
    app.get('/api/snippets', function (req, res) {
        console.log('get /api/snippets');
        // FIXME: implement snippet query parameters (by team, by user, etc)
        firebase
            .collection('snippets')
            .orderBy('timeCreated', 'desc')
            .get()
            .then(function (snapshot) {
            // snapshot.docs.forEach((doc: any) => {
            //   console.log(doc.id, doc.data());
            // });
            res.send(snapshot.docs.map(function (doc) { return doc.data(); }));
            // res.send(dummydata.snippets);
        })
            .catch(function (err) {
            console.log('Error getting snippets.', err);
        });
    });
};
