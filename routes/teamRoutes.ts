import { Request, Response } from "express";

module.exports = (app: any, firebase: any) => {
  app.post("/api/add_team", (req: Request, res: Response) => {
    console.log(req.body);

    const {
      name,
      members,
      roles
    } = req.body;

    const team = {
        // title,
        // content,
        // description,
        // ownerID,
        // ownerName,
        // status,
        // team,
        // timeCreated: new Date(),
        // totalComments: 0,
        // totalLikes: 0
        name,
        members,
        roles
    };
    firebase.collection("teams").add(team);
  });

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
