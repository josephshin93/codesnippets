import { Request, Response } from "express";
import { User, Snippet } from "../types";
import { firestore } from "firebase-admin";
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
    let weekSelected = req.query.weekSelected || moment().format('W');

    // Append filters for user and/or week
    if (userSelected) {
      console.log(userSelected);
      query = query.where("ownerID", "==", userSelected);
    }
    query = query.where('week', '==', weekSelected);


    // FIXME: should probably use an HTTP error code
    if (!req.user) res.send({});
    const user = <User>req.user;

    // query for snippets
    console.log(
      'Route: GET /api/snippets', '->',
      'querying for snippets of week', 
      weekSelected, 
      ' and owner' , 
      userSelected
    );
    query.get()
    .then((snapshot: any) => {
      let snippets = snapshot.docs.map((doc: any) => doc.data());
      // console.log(snippets);
      
      if (!teamSelected || teamSelected === '') {

        // query for current user in order to get the list of teams
        console.log(
          'Route: GET /api/snippets', '->','querying for user', user.id
        );
        firebase.collection('users').doc(user.id).get()
        .then((doc: any) => {
          const userTeams = doc.data().teams;
          // console.log(doc.data());

          // send snippets only from teams that the user is a part of
          res.send(snippets.filter(
            (snippet: Snippet) => userTeams.includes(snippet.team)
          ));

        })
        .catch((error: any) => {
          console.error(
            'Error getting user ' + user.id + ' teams in getting snippet list',
            error
          );
        });
        
      } else {
        
        // send snippets only from selected team
        res.send(snippets.filter(
          (snippet: Snippet) => snippet.team == teamSelected
        ));

      }
    
    })
    .catch((error: any) => {
      console.error(
        'Error getting snippets of week \'' + weekSelected + '\'',
        error
      );
    });
  });
};
