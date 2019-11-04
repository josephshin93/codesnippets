import { Request, Response } from 'express';

module.exports = (app: any, firebase: any) => {
    app.get(
        '/api/snippets', 
        (req: Request, res: Response) => {

            var ref = firebase.collection('snippets').get().then((snapshot: any) => {
                res.send( snapshot.docs.map(doc => doc.data()) );
            }).catch((err: any) => { 
                console.log('Error getting snippets.', err) 
            });
        }
    );
}