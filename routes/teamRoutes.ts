import { Request, Response } from "express";

module.exports = (app: any, firebase: any) => {
//   app.post("/api/add_snippet", (req: Request, res: Response) => {
//     console.log(req.body);

//     const {
//       content,
//       description,
//       ownerID,
//       ownerName,
//       status,
//       team,
//       title
//     } = req.body;

//     const snippet = {
//       title,
//       content,
//       description,
//       ownerID,
//       ownerName,
//       status,
//       team,
//       timeCreated: new Date(),
//       totalComments: 0,
//       totalLikes: 0
//     };
//     firebase.collection("snippets").add(snippet);
//   });

  app.get("/api/teams", (req: Request, res: Response) => {
    firebase
      .collection("teams")
      .get()
      .then((snapshot: any) => {
        res.send(snapshot.docs.map((doc: any) => doc.data()));
      })
      .catch((err: any) => {
        console.log("Error getting teams.", err);
      });
  });
};
