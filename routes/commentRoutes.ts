import { Request, Response } from "express";
import { User } from "../types";

module.exports = (app: any, firebase: any) => {
  app.get("/api/comments", (req: Request, res: Response) => {
    console.log("Route: GET /api/comments");

    // Setup query variables
    let snippetId = req.query.id;
    let query = firebase
      .collection("snippets")
      .doc(snippetId)
      .collection("comments")
      .orderBy("timeCreated");

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

  // Add a comment
  app.post("/api/add_comment", (req: Request, res: Response) => {
    const user = <User>req.user;
    if (!user) {
      res.send({});
    } else {
      const snippetId = req.body.snippetId;
      let thisComment = {
        comment: req.body.comment,
        timeCreated: new Date(),
        googleId: user.googleId,
        userPicture: user.picture
      };

      firebase
        .collection("snippets")
        .doc(snippetId)
        .collection("comments")
        .add(thisComment);
    }
  });

  // Delete a comment
  app.delete("/api/delete_comment", (req: Request, res: Response) => {
    const user = <User>req.user;
    if (!user) {
      res.send({});
    } else {
      // Setup query variables
      const thisSnippet = req.query.snippetId;
      const thisComment = req.query.commentId;

      // Setup query
      let query = firebase
        .collection("snippets")
        .doc(thisSnippet)
        .collection("comments")
        .doc(thisComment);

      // Delete comment from database
      query.delete().catch((err: any) => {
        console.log("Error deleting comment", err);
      });
    }
  });
};
