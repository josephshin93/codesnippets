const passport = require('passport');
import { Request, Response } from 'express';
import { User } from '../types';

module.exports = (app: any, firebase: any) => {
  app.get(
    '/auth/google', 
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );
  
  app.get(
    '/auth/google/callback', 
    passport.authenticate('google'),
    (req: Request, res: Response) => {
      // console.log('get /auth/google/callback');
      // console.log('req.user', req.user);

      res.redirect('/?token=' + JSON.stringify(req.user));
    }
  );
  
  app.get(
    '/api/logout', 
    (req: Request, res: Response) => {
      req.logout();
      res.redirect('/?logout=true');
    }
  );    

  app.get(
    '/api/current_user', 
    (req: Request, res: Response) => {

      // retrieve user from database and send it to user
      const user: User = <User>req.user;
      firebase.collection('users').doc(user.id).get()
      .then((doc: any) => {
        res.send({ id: doc.id, ...doc.data() });
      })
      .catch((error: any) => {
        console.error('Error retrieving current user', error);
      })
    }
  );

  app.get(
    '/api/all_users',
    (req: Request, res: Response) => {
      console.log('get /api/all_users');

      // retrieve all users from database
      firebase.collection('users').get()
      .then((snapshot: any) => {
        let allUsers: Array<User> = [];
        snapshot.forEach((doc: any) => {
          allUsers.push({ id: doc.id, ...doc.data()});
        });
        res.send(allUsers);
      })
      .catch((error: any) => {
        console.error('Error retrieving all users', error);
      })
    }
  );
}
