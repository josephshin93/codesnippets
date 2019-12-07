import { Request, Response } from "express";
import { User } from "../types";

module.exports = (app: any, firebase: any) => {
  // Get list of users in database
  // Usage #1: Populate user names in filter dropdown
  app.get("/api/users", (req: Request, res: Response) => {
    console.log("Route: get /api/users");

    // Reference users collection in database and current team
    // let query = firebase.collection("users");
    let teamSelected = req.query.teamSelected || null;

    // // Handle filter
    // if (teamSelected && teamSelected !== "all") {
    //   console.log("Team selected is " + teamSelected);
    //   query = query.where("teams", "array-contains", teamSelected);
    // }

    // // Retrieve users
    // query
    //   .get()
    //   .then((snapshot: any) => {
    //     res.send(snapshot.docs.map((doc: any) => doc.data()));
    //   })
    //   .catch((err: any) => {
    //     console.log("Error getting users.", err);
    //   });

    // query all users then filter the list of users if necessary
    firebase.collection('users').get()
    .then((snapshot: any) => {
      let selectedUsers: Array<User> = snapshot.docs.map(
        (doc: any) => { 
          return {...doc.data(), id: doc.id };
        }
      );

      // filter list of users for users who are part of the selected team
      if (teamSelected && teamSelected !== 'all') {
        selectedUsers = selectedUsers.filter(
          (user) => {
            if (user.teams) {
              return user.teams.map((team) => team.teamId).includes(teamSelected);
            } else {
              return false;
            }
          }
        );
      }

      // console.log('users from team', teamSelected, selectedUsers);

      res.send(selectedUsers);
    })
    .catch((error: any) => {
      console.error(
        'Error getting users from team with id', 
        teamSelected, 
        error
      );
    });

    

  });
};
