import { Request, Response } from "express";

module.exports = (app: any, firebase: any) => {
  // Get list of users in database
  // Usage #1: Populate user names in filter dropdown
  app.get("/api/users", (req: Request, res: Response) => {
    console.log("Route: get /api/users");

    // Reference users collection in database and current team
    let query = firebase.collection("users");
    let teamSelected = req.query.teamSelected || null;

    // Handle filter
    if (teamSelected && teamSelected !== "all") {
      console.log("Team selected is " + teamSelected);
      query = query.where("teams", "array-contains", { teamId: teamSelected });
    }

    // Retrieve users
    query
      .get()
      .then((snapshot: any) => {
        res.send(snapshot.docs.map((doc: any) => doc.data()));
      })
      .catch((err: any) => {
        console.log("Error getting users.", err);
      });
  });
};
