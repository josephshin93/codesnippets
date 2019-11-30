import { Request, Response } from "express";
var moment = require("moment");

module.exports = (app: any, firebase: any) => {
  app.post("/api/add_snippet", (req: Request, res: Response) => {
    console.log("post /api/add_snippet");
    // console.log(req.body);

    const {
      content,
      description,
      ownerID,
      ownerName,
      status,
      team,
      title
    } = req.body;

    const snippet = {
      title,
      content,
      description,
      ownerID,
      ownerName,
      status,
      team,
      week: moment().format("W"),
      timeCreated: new Date(),
      totalComments: 0,
      totalLikes: 0
    };
    firebase.collection("snippets").add(snippet);
  });

  app.get("/api/snippets", (req: Request, res: Response) => {
    console.log("Route: GET /api/snippets");

    // Setup query then filters if they exist
    let query = firebase.collection("snippets");
    let teamSelected = req.query.teamSelected || null;
    let userSelected = req.query.userSelected || null;
    let weekSelected = req.query.weekSelected || null;

    // Append filters for team, user, and/or week
    // Otherwise, query all snippets for current week
    if (teamSelected) {
      console.log(teamSelected);
      query = query.where("team", "==", teamSelected);
    }
    if (userSelected) {
      console.log(userSelected);
      query = query.where("ownerID", "==", userSelected);
    }
    if (weekSelected) {
      console.log(weekSelected);
      query = query.where("week", "==", weekSelected);
    } else {
      console.log("default week = " + moment().format("W"));
      query = query.where("week", "==", moment().format("W"));
    }

    // Retrieve snippets from database
    query
      .get()
      .then((snapshot: any) => {
        res.send(
          snapshot.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          })
        );
      })
      .catch((err: any) => {
        console.log("Error getting snippets.", err);
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

  /*
  app.get("/api/snippetComment", (req: Request, res: Response) => {
    console.log("Route: GET /api/snippetComment");

    // Setup query variables
    //let snippetId = req.query.id;
    let query = firebase
      .collection("comments")
      .where("commentId", "==", "wHluxCee7or8J2ppINOV");

    // Retrieve comments from database
    query
      .get()
      .then((snapshot: any) => {
        res.send(
          snapshot.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          })
        );
      })
      .catch((err: any) => {
        console.log("Error getting comments", err);
      });
  });
  */
};
