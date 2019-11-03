const passport = require('passport');
import { Request, Response } from 'express';

module.exports = (app: any) => {
    app.get(
        '/auth/google', 
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );
    
    app.get(
        '/auth/google/callback', 
        passport.authenticate('google')
    );
    
    app.get(
        '/api/logout', 
        (req: Request, res: Response) => {
            req.logout();
            res.send("LOGGED OUT");
        }
    );    

    app.get(
        '/api/current_user', 
        (req: Request, res: Response) => {
            res.send(req.user);
        }
    );

    app.get(
        '/', 
        (req: Request, res: Response) => {
            res.send({ helloworld: 'test' });
    });
}