import { Request, Response } from "express";
import * as dummydata from "./DummyData";

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
      console.log("default week");
      query = query.where("week", "==", "47");
    }

    // Retrieve snippets from database
    query
      .get()
      .then((snapshot: any) => {
        res.send(snapshot.docs.map((doc: any) => doc.data()));
      })
      .catch((err: any) => {
        console.log("Error getting snippets.", err);
      });
  });
};
