"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_admin_1 = require("firebase-admin");
// TODO: add types to queries
module.exports = function (app, firebase) {
    app.post('/api/add_team', function (req, res) {
        console.log('post /api/add_team');
        // console.log('req.body', req.body);
        // console.log('req.user', req.user);
        var newTeam = {
            name: req.body.name,
            members: req.body.members,
            roles: req.body.roles,
            subscriptions: req.body.subscriptions,
        };
        var user = req.user;
        // an empty response is sent if the user id does not exist
        if (!user.id) {
            res.send({});
        }
        // add in user as member and admin if that is not present
        if (!newTeam.members[user.id]) {
            newTeam.members[user.id] = user.firstName + ' ' + user.lastName;
        }
        if (!newTeam.roles[user.id]) {
            newTeam.roles[user.id] = 'admin';
        }
        // console.log('new team', newTeam);
        firebase.collection('teams').add(newTeam)
            .then(function (docRef) {
            // console.log('added doc', docRef.id);
            // add new team to user's teams
            firebase.collection('users').doc(user.id).update({
                teams: firebase_admin_1.firestore.FieldValue.arrayUnion(docRef.id)
            })
                .then(function () {
                res.send({ newTeamId: docRef.id });
            })
                .catch(function (error) {
                console.error('Error updating user\'s team array', error);
            });
        })
            .catch(function (error) {
            console.error('Error adding team document', error);
        });
    });
    app.get('/api/teams', function (req, res) {
        console.log('get /api/teams');
        // console.log(req.user);
        // console.log(req.query);
        var teams = {};
        var user = req.user;
        if (!user || !user.id) {
            console.log('invalid user or no user id');
            res.send(teams);
        }
        else {
            // query current user to get list of user's teams
            firebase.collection('users').doc(user.id).get()
                .then(function (doc) {
                var currentUser = doc.data();
                if (!currentUser.teams || currentUser.teams.length === 0) {
                    console.log('doc did not have teams', currentUser);
                    res.send(teams);
                }
                else {
                    /**
                     * get document references for all teams
                     *   duplicate team ids will result in duplicate results
                     *   non-existent team ids will result in a null object
                     */
                    var teamRefs = currentUser.teams.map(function (teamId) {
                        return firebase.collection('teams').doc(teamId);
                    });
                    // query all user's teams
                    firebase.getAll.apply(firebase, teamRefs).then(function (docs) {
                        docs.forEach(function (doc) {
                            // console.log(doc.id, doc.data());
                            teams[doc.id] = doc.data();
                        });
                        res.send(teams);
                    })
                        .catch(function (err) {
                        console.log('Error getting teams.', err);
                    });
                }
            })
                .catch(function (error) {
                console.error('Error getting current user for getting user\'s teams', error);
            });
        }
    });
};
