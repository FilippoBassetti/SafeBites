const app = require('./app/app.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;

mongoose.connect('mongodb+srv://filippobassetti:yn55_42N7ML47U6@cluster0sb.p4q6k.mongodb.net/Safebites?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to Database');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });

/*
app.locals.db = mongoose.connect('mongodb+srv://filippobassetti:<yn55_42N7ML47U6>@cluster0sb.p4q6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0SB')
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});*/



