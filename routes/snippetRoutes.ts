import { Request, Response } from "express";
import { User, Snippet, UserTeam } from "../types";
var moment = require("moment");
const FieldValue = require("firebase-admin").firestore.FieldValue;

module.exports = (app: any, firebase: any) => {
  app.post("/api/add_snippet", (req: Request, res: Response) => {
    // Add snippet only if they're the user
    const user: User = <User>req.user;
    if (!user) {
      res.send({});
    } else {
      // Make snippet object
      let snippet: any = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        content: req.body.content,
        ownerID: user.googleId,
        ownerFirstName: user.firstName,
        ownerLastName: user.lastName,
        ownerPicture: user.picture,
        week: moment().format("W"),
        timeCreated: new Date(),
        totalComments: 0,
        totalLikes: 0
      };
      if (req.body.team) snippet.team = req.body.team;

      // Add snippet to database
      firebase.collection("snippets").add(snippet);
    }
  });

  app.get("/api/snippets", (req: Request, res: Response) => {
    console.log("Route: GET /api/snippets");

    // Setup query then filters if they exist
    let query = firebase.collection("snippets");
    let teamSelected = req.query.teamSelected || null;
    let userSelected = req.query.userSelected || null;
    let weekSelected = req.query.weekSelected || moment().format("W");

    // Append filters for user and/or week
    if (userSelected) {
      console.log("user selected: ", userSelected);
      query = query.where("ownerID", "==", userSelected);
    }
    query = query.where("week", "==", weekSelected);

    // FIXME: should probably use an HTTP error code
    if (!req.user) res.send({});
    const user = <User>req.user;

    // query for snippets
    console.log(
      "Route: GET /api/snippets",
      "->",
      "querying for snippets of week",
      weekSelected,
      "and owner",
      userSelected,
      "and team",
      teamSelected
    );
    query
      .get()
      .then((snapshot: any) => {
        let snippets = snapshot.docs.map((doc: any) => {
          return { ...doc.data(), id: doc.id };
        });
        // console.log(snippets);

        if (!teamSelected || teamSelected === "") {
          // query for current user in order to get the list of teams
          console.log(
            "Route: GET /api/snippets",
            "->",
            "querying for user",
            user.id
          );
          firebase
            .collection("users")
            .doc(user.id)
            .get()
            .then((doc: any) => {
              let userTeams = doc
                .data()
                .teams.map((team: UserTeam) => team.teamId);
              userTeams.push("");
              // console.log(doc.data());

              // send snippets only from teams that the user is a part of
              res.send(
                snippets.filter((snippet: Snippet) => {
                  return (
                    !snippet.team || userTeams.includes(snippet.team.teamId)
                  );
                })
              );
            })
            .catch((error: any) => {
              console.error(
                "Error getting user " +
                  user.id +
                  " teams in getting snippet list",
                error
              );
            });
        } else if (teamSelected === "personal") {
          /**
           * send snippets that current user created but does not belong to team
           *   this is the current definition of personal snippets
           */
          const personalSnippets = snippets.filter((snippet: Snippet) => {
            // console.log(snippet.title, snippet.ownerID, snippet.team);
            return snippet.ownerID === user.googleId && !snippet.team;
          });
          // console.log('personal snippets', personalSnippets);
          res.send(personalSnippets);
        } else {
          // send snippets only from selected team
          res.send(
            snippets.filter((snippet: Snippet) => {
              return snippet.team && snippet.team.teamId == teamSelected;
            })
          );
        }
      })
      .catch((error: any) => {
        console.error(
          "Error getting snippets of week '" + weekSelected + "'",
          error
        );
      });
  });

  // Get single snippet
  app.get("/api/snippet", (req: Request, res: Response) => {
    console.log("Route: GET api/snippet");

    // Setup query variables
    let query = firebase.collection("snippets");
    let snippetID = req.query.id;

    // Retrieve snippet from database
    query
      .doc(snippetID)
      .get()
      .then((doc: any) => {
        res.send(doc.data());
      })
      .catch((err: any) => {
        console.log("Error getting snippet", err);
      });
  });

  // Like a snippet
  app.put("/api/like_snippet", (req: Request, res: Response) => {
    // Like snippet only if they're the user
    const user: User = <User>req.user;
    // https://stackoverflow.com/questions/47091940/fieldvalue-undefined-when-using-functions-and-firestore
    const increment = FieldValue.increment(1);
    if (!user) {
      res.send({});
    } else {
      // Reference the snippets
      let query = firebase.collection("snippets").doc(req.body.id);
      let snippetId: string = req.body.id;
      console.log("Route snippet id ", snippetId);
      // Update the count
      query.update({ totalLikes: increment }).then((doc: any) => {
        // Add the user to likes array
        query
          .update({ likes: FieldValue.arrayUnion(user.googleId) })
          .catch((err: any) => {
            console.error("Error updating likes", err);
          });
      });
    }
  });

  // Dislike a snippet
  app.put("/api/dislike_snippet", (req: Request, res: Response) => {
    // Like snippet only if they're the user
    const user: User = <User>req.user;
    // https://stackoverflow.com/questions/47091940/fieldvalue-undefined-when-using-functions-and-firestore
    const decrement = FieldValue.increment(-1);
    if (!user) {
      res.send({});
    } else {
      // Reference the snippets
      let query = firebase.collection("snippets").doc(req.body.id);
      let snippetId: string = req.body.id;
      console.log("Route snippet id ", snippetId);
      // Update the count
      query.update({ totalLikes: decrement }).then((doc: any) => {
        // Remove the user from likes array
        query
          .update({ likes: FieldValue.arrayRemove(user.googleId) })
          .catch((err: any) => {
            console.error("Error updating dislikes", err);
          });
      });
    }
  });
};
