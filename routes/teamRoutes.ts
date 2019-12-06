import { Request, Response } from "express";
import { User, Teams, Team } from "../types";
import { firestore } from "firebase-admin";
const scheduler = require("../services/scheduler");

// TODO: add types to queries
// TODO: use better response status codes
module.exports = (app: any, firebase: any) => {
  app.post("/api/edit_team", (req: Request, res: Response) => {
    console.log("post /api/edit_team");
    // console.log('req.body', req.body);
    // console.log('req.user', req.user);

    const editedTeam: Team = {
      name: req.body.name,
      members: req.body.members,
      roles: req.body.roles,
      subscriptions: req.body.subscriptions
    };

    const user = <User>req.user;
    // an empty response is sent if the user id does not exist
    if (!user.id) {
      res.send({});
    }

    // console.log('edited team', editedTeam);

    firebase
      .collection("teams")
      .doc(req.body.teamId)
      .set(editedTeam)
      .then((docRef: any) => {
        // console.log('team edit done');

        // FIXME: what do i send back?
        res.send({});
      })
      .catch((error: any) => {
        console.error("Error editing team document", error);
      });

    scheduler.scheduleSubscriptions(firebase, editedTeam);
  });

  app.post("/api/add_team", (req: Request, res: Response) => {
    console.log("post /api/add_team");
    // console.log('req.body', req.body);
    // console.log('req.user', req.user);

    const newTeam: Team = {
      name: req.body.name,
      members: req.body.members,
      roles: req.body.roles,
      subscriptions: req.body.subscriptions
    };

    const user = <User>req.user;
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

    firebase
      .collection("teams")
      .add(newTeam)
      .then((docRef: any) => {
        // console.log('added doc', docRef.id);

        // add new team to user's teams
        firebase
          .collection("users")
          .doc(user.id)
          .update({
            teams: firestore.FieldValue.arrayUnion(docRef.id)
          })
          .then(() => {
            res.send({ newTeamId: docRef.id });
          })
          .catch((error: any) => {
            console.error("Error updating user's team array", error);
          });
      })
      .catch((error: any) => {
        console.error("Error adding team document", error);
      });

    // Schedule team's subscriptions
    scheduler.scheduleSubscriptions(firebase, newTeam);
  });

  app.get("/api/teams", (req: Request, res: Response) => {
    console.log("get /api/teams");
    // console.log(req.user);
    // console.log(req.query);

    let teams: Teams = {};
    const user: User | null | undefined = <User>req.user;
    if (!user || !user.id) {
      console.log("invalid user or no user id");
      res.send(teams);
    } else {
      // query current user to get list of user's teams
      firebase
        .collection("users")
        .doc(user.id)
        .get()
        .then((doc: any) => {
          const currentUser = doc.data();
          if (!currentUser.teams || currentUser.teams.length === 0) {
            console.log("doc did not have teams", currentUser);
            res.send(teams);
          } else {
            /**
             * get document references for all teams
             *   duplicate team ids will result in duplicate results
             *   non-existent team ids will result in a null object
             */
            const teamRefs = currentUser.teams.map((teamId: string) => {
              return firebase.collection("teams").doc(teamId);
            });

            // query all user's teams
            firebase
              .getAll(...teamRefs)
              .then((docs: any) => {
                docs.forEach((doc: any) => {
                  // console.log(doc.id, doc.data());
                  teams[doc.id] = doc.data();
                });
                res.send(teams);
              })
              .catch((err: any) => {
                console.log("Error getting teams.", err);
              });
          }
        })
        .catch((error: any) => {
          console.error(
            "Error getting current user for getting user's teams",
            error
          );
        });
    }
  });

  app.get("/api/team", (req: Request, res: Response) => {
    console.log("get /api/team");
    // console.log(req.user);
    // console.log(req.query);

    // retrieve the target team from database and send it to client
    firebase
      .collection("teams")
      .doc(req.query.targetTeamId)
      .get()
      .then((doc: any) => {
        res.send({ ...doc.data() });
      })
      .catch((error: any) => {
        console.error(
          "Error retrieving the team with id " + req.query.targetTeamId,
          error
        );
      });
  });
};
