import {
  Request,
  Response
} from 'express';
import {
  User,
  Teams,
} from '../types';
import * as dummydata from './DummyData';

module.exports = (app: any, firebase: any) => {
  // app.post("/api/add_team", (req: Request, res: Response) => {
  //   console.log(req.body);

  //   const {
  //     content,
  //     description,
  //     ownerID,
  //     ownerName,
  //     status,
  //     team,
  //     title
  //   } = req.body;

  //   const team = {
  //     title,
  //     content,
  //     description,
  //     ownerID,
  //     ownerName,
  //     status,
  //     team,
  //     timeCreated: new Date(),
  //     totalComments: 0,
  //     totalLikes: 0
  //   };
  //   firebase.collection('teams').add(team);
  // });

  app.get('/api/teams', (req: Request, res: Response) => {
    console.log('get /api/teams');
    // console.log(req.user);
    // console.log(req.query);

    const user: User | null | undefined = <User>req.user
    if (user && user.teams) {
      /**
       * get document references for all teams
       *   duplicate team ids will result in duplicate results
       *   non-existent team ids will result in a null object
       */
      const teamRefs = user.teams.map((teamId) => {
        // console.log('making document reference for '+teamId);
        return firebase.collection('teams').doc(teamId);
      });

      firebase
      .getAll(...teamRefs)
      .then((docs: any) => {
        let teams: Teams = {};
        docs.forEach((doc: any) => {
          // console.log(doc.id, doc.data());
          teams[doc.id] = doc.data();
        });
        res.send(teams);
      })
      .catch((err: any) => {
        console.log('Error getting teams.', err);
      });
    } else {
      res.send({});
    }

  });
};
