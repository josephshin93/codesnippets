const express = require('express');
import { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send({ helloworld: 'test' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
