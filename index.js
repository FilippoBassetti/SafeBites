const app = require('./app/app.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

/**
 * https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment#4-listen-on-the-correct-port
 */
const port = process.env.PORT || 8080;


/**
 * Configure mongoose
 */
// mongoose.Promise = global.Promise;
app.locals.db = mongoose.connect('mongodb+srv://filippobassetti:<filippobassetti>@cluster0sb.p4q6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0SB', {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});



