import express from 'express';
import bodyParser from 'body-parser';
import db from './queries.js';

var app = express();
const port = 3000;

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.listen(port, () => {
    console.log(`Localiser service running on port ${port}.`);
});

app.get('/info', (request, response) => {
    response.json({
        info: 'Localiser - built with NodeJS, Express, ReactJS, and a little caffeine.'
    });
});

app.get('/users', db.getUsers);
