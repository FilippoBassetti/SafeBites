const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const authentication = require('./middlewares/authentication.js');
const tokenChecker = require('./middlewares/tokenChecker.js');

const restaurants = require('./controllers/restaurants.js');
const users = require('./controllers/users.js')
const reviews = require('./controllers/reviews.js')
const ratings = require('./controllers/ratings.js')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route to serve index.html for Vue routing (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.use(

    (req, res, next) => {
        console.log(`recived ${req.method + " " + req.hostname + req.url}`);
        next();
    }
)

app.use('/api/v1/authentications', authentication);

app.use('/api/v1/restaurants', (req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        tokenChecker(req, res, next);
    } else {
        next(); // Allow GET without authentication
    }
});

app.use('/api/v1/users', (req, res, next) => {
    if (['PUT', 'DELETE', ].includes(req.method)) {
        tokenChecker(req, res, next);
    } else if (req.path === '/me') {
        tokenChecker(req, res, next);
    } else {
        next(); // Allow GET without authentication
    }
});

app.use('/api/v1/reviews', (req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        tokenChecker(req, res, next);
    } else {
        next(); // Allow GET without authentication
    }
});

app.use('/api/v1/ratings', (req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        tokenChecker(req, res, next);
    } else {
        next(); // Allow GET without authentication
    }
});

app.use('/api/v1/restaurants', restaurants);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/ratings', ratings);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

/* Default error handler */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});



module.exports = app;