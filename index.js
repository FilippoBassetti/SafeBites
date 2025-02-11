const app = require('./app/app.js');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');
require('dotenv').config({ path: './.env.example' });
const port = process.env.PORT || 8081;


/*
mongoose.connect('mongodb+srv://filippobassetti:password@cluster0sb.p4q6k.mongodb.net/Safebites?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to Database');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });
  */

app.locals.db = mongoose.connect(process.env.DB_URL)
  .then(() => {

    console.log("Connected to Database");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });

  }).catch((err) => {
    console.error('Database connection error:', err.message);
  });




