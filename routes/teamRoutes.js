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
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_admin_1 = require("firebase-admin");
var scheduler = require("../services/scheduler");
// TODO: add types to queries
// TODO: use better response status codes
module.exports = function (app, firebase) {
    app.post("/api/edit_team", function (req, res) {
        console.log("post /api/edit_team");
        // console.log('req.body', req.body);
        // console.log('req.user', req.user);
        var editedTeam = {
            name: req.body.name,
            members: req.body.members,
            roles: req.body.roles,
            subscriptions: req.body.subscriptions
        };
        // console.log('edited team', editedTeam);
        var user = req.user;
        // an empty response is sent if the user id does not exist
        if (!user.id) {
            res.send({});
        }
        // query current team in order to generate member diff data
        firebase.collection('teams').doc(req.body.teamId).get()
            .then(function (doc) {
            var oldTeam = doc.data();
            var newUserTeam = {
                teamId: req.body.teamId,
                teamName: editedTeam.name
            };
            var oldUserTeam = {
                teamId: req.body.teamId,
                teamName: oldTeam.name
            };
            // find members that have been added and members that have been removed
            var newMembers = Object.keys(editedTeam.members).filter(function (userId) { return !Object.keys(oldTeam.members).includes(userId); });
            var sameMembers = Object.keys(editedTeam.members).filter(function (userId) { return !newMembers.includes(userId); });
            var removedMembers = Object.keys(oldTeam.members).filter(function (userId) { return !Object.keys(editedTeam.members).includes(userId); });
            // create two batch queries for user edits and also team edit
            /**
             * create two batch queries for user edits
             *   the first is removal of teams from users' team lists
             *   the second is the addition of teams from users' team lists
             */
            var removeBatch = firebase.batch();
            (removedMembers.concat(sameMembers)).forEach(function (userId) {
                removeBatch.update(firebase.collection('users').doc(userId), {
                    teams: firebase_admin_1.firestore.FieldValue.arrayRemove(oldUserTeam)
                });
            });
            var addBatch = firebase.batch();
            (newMembers.concat(sameMembers)).forEach(function (userId) {
                addBatch.update(firebase.collection('users').doc(userId), {
                    teams: firebase_admin_1.firestore.FieldValue.arrayUnion(newUserTeam)
                });
            });
            /**
             * execute queries in the following order:
             *   removal queries, then add queries, then finally the team edit query
             */
            removeBatch.commit()
                .then(function () {
                addBatch.commit()
                    .then(function () {
                    firebase.collection('teams').doc(req.body.teamId).update(editedTeam).
                        then(function (docRef) {
                        res.send({});
                    })
                        .catch(function (error) {
                        console.error('Error editting team document', error);
                    });
                })
                    .catch(function (error) {
                    console.error('Error adding teams to users\' team lists', error);
                });
            })
                .catch(function (error) {
                console.error('Error removing teams to users\' team lists', error);
            });
        })
            .catch(function (error) {
            console.error('Error getting prior-to-edit team', error);
        });
        scheduler.scheduleSubscriptions(firebase, editedTeam);
    });
    app.post("/api/add_team", function (req, res) {
        console.log("post /api/add_team");
        // console.log('req.body', req.body);
        // console.log('req.user', req.user);
        var newTeam = {
            name: req.body.name,
            members: req.body.members,
            roles: req.body.roles,
            subscriptions: req.body.subscriptions
        };
        var user = req.user;
        // an empty response is sent if the user id does not exist
        if (!user.id) {
            res.send({});
        }
        // add in user as member and admin if that is not present
        if (!newTeam.members[user.id]) {
            newTeam.members[user.id] = user.firstName + " " + user.lastName;
        }
        if (!newTeam.roles[user.id]) {
            newTeam.roles[user.id] = "admin";
        }
        // console.log('new team', newTeam);
        firebase.collection("teams").add(newTeam).then(function (docRef) {
            // console.log('added doc', docRef.id);
            // add new team to all users in the team
            var batch = firebase.batch();
            Object.keys(newTeam.members).forEach(function (userId) {
                batch.update(firebase.collection('users').doc(userId), {
                    teams: firebase_admin_1.firestore.FieldValue.arrayUnion({
                        teamId: docRef.id,
                        teamName: newTeam.name
                    })
                });
            });
            batch.commit()
                .then(function () {
                res.send({ newTeamId: docRef.id });
            })
                .catch(function (error) {
                console.error('Error updating users affected by new team', error);
            });
        })
            .catch(function (error) {
            console.error("Error adding team document", error);
        });
        // Schedule team's subscriptions
        scheduler.scheduleSubscriptions(firebase, newTeam);
    });
    app.get("/api/teams", function (req, res) {
        console.log("get /api/teams");
        // console.log(req.user);
        // console.log(req.query);
        var teams = {};
        var user = req.user;
        if (!user || !user.id) {
            console.log("invalid user or no user id");
            res.send(teams);
        }
        else {
            // query current user to get list of user's teams
            firebase
                .collection("users")
                .doc(user.id)
                .get()
                .then(function (doc) {
                var currentUser = doc.data();
                if (!currentUser.teams || currentUser.teams.length === 0) {
                    console.log("doc did not have teams", currentUser);
                    res.send(teams);
                }
                else {
                    /**
                     * get document references for all teams
                     *   duplicate team ids will result in duplicate results
                     *   non-existent team ids will result in a null object
                     */
                    // TODO: type team param
                    var teamRefs = currentUser.teams.map(function (team) {
                        return firebase.collection('teams').doc(team.teamId);
                    });
                    // query all user's teams
                    firebase
                        .getAll.apply(firebase, teamRefs).then(function (docs) {
                        docs.forEach(function (doc) {
                            // console.log(doc.id, doc.data());
                            teams[doc.id] = doc.data();
                        });
                        res.send(teams);
                    })
                        .catch(function (err) {
                        console.log("Error getting teams.", err);
                    });
                }
            })
                .catch(function (error) {
                console.error("Error getting current user for getting user's teams", error);
            });
        }
    });
    app.get("/api/team", function (req, res) {
        console.log("get /api/team");
        // console.log(req.user);
        // console.log(req.query);
        // retrieve the target team from database and send it to client
        firebase
            .collection("teams")
            .doc(req.query.targetTeamId)
            .get()
            .then(function (doc) {
            res.send(__assign({}, doc.data()));
        })
            .catch(function (error) {
            console.error("Error retrieving the team with id " + req.query.targetTeamId, error);
        });
    });
};
