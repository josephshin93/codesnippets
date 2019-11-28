import { Request, Response } from "express";

/*
module.exports = (app: any, firebase: any) => {
  app.get("/api/comments", (req: Request, res: Response) => {
    console.log("Route: GET /api/comments");

    // Setup query variables
    let snippetId = req.query.id;
    let query = firebase
      .collection("snippets")
      .doc(snippetId)
      .collection("comments");

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
};
*/
