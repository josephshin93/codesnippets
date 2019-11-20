import { Request, Response } from 'express';
import * as dummydata from './DummyData';

module.exports = (app: any, firebase: any) => {
  app.post('/api/add_snippet', (req: Request, res: Response) => {
    console.log('/api/add_snippet');
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
    firebase.collection('snippets').add(snippet);
  });

  app.get('/api/snippets', (req: Request, res: Response) => {
    console.log('get /api/snippets');

    // FIXME: implement snippet query parameters (by team, by user, etc)
    firebase
      .collection('snippets')
      .orderBy('timeCreated', 'desc')
      .get()
      .then((snapshot: any) => {
        // snapshot.docs.forEach((doc: any) => {
        //   console.log(doc.id, doc.data());
        // });
        res.send(snapshot.docs.map((doc: any) => doc.data()));
        // res.send(dummydata.snippets);
      })
      .catch((err: any) => {
        console.log('Error getting snippets.', err);
      });

  });
};
