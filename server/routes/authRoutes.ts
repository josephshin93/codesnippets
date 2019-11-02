import passport from 'passport';
import { Request, Response } from 'express';

module.exports = (app) => {
    app.get(
        '/auth/google', 
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );
    
    app.get(
        '/auth/google.callback', 
        passport.authenticate('google')
    );
    
    app.get(
        '/', 
        (req: Request, res: Response) => {
            res.send({ helloworld: 'test' 
        });
    });
}