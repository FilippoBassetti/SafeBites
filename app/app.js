const express = require('express');
const app = express();
const cors = require('cors');


const restaurants = require('./restaurants.js');
const users = require('./users.js')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());


app.use('/api/v1/restaurants', restaurants);
app.use('/api/v1/users', users);

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