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
        passport.authenticate('google'),
        (req: Request, res: Response) => {
            // console.log(req.user);
            // res.redirect('/dashboard');
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
            res.send(req.user);
        }
    );
}