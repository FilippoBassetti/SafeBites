const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());


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