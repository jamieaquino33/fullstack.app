
//Mongoose - allows us to set up the schemas for the data er store in out MongoDB database We will also set up our database connection using Mongoose.
const mongoose = require('mongoose');
//Express - framework for nodeJS. handles our routing and connection info (port, etc.)
const express = require('express');
//Morgan - Handles logging stuff for databases.
const logger = require('morgan');
//Body-Parser - Makes sure the body of our request is formatted correctly (in this case, we'll use JSON)
const bodyParser = require('body-parser');
//import the getsecret function from the secret.js
const getSecret = require('./secret');
//Import the mongoose schema for our data
const Data = require('./DataSchema');
//Constant to hold the port that we are going to use to connect
const API_PORT = 3001;
//Create an Express app that will run on our Node server and route our requests.
const app = express();
//Create an Express router which actually handles the routing
const router = express.Router();
//use Mongoose to set uo a connection to the database
mongoose.connect(getSecret('dbUrl'), { useNewUrlParser: true, useFindAndModify: false });
//Reference to our database connection
let db = mongoose.connection;
//Use the database connection to print out an error if one occurs wehn we try to connect to the database
db.on('error', console.error .bind(console, 'MongoDB connection error:'));
//Configure body-parser and morgan
app.use(bodyParser.urlencoded({ extended: false })); //used for parsing data formatted in the x-www-form-urlencoded format
app.use(bodyParser.json()); //Used for parsing data formatted in the JSON format
app.use(logger('dev'));
//Default route that will run whemever we first connect to the server
router.get('/', (req, res) => {
    res.json({ message: 'HELLO WORLD' });
});
//route to retrieve data from the database
router.get('./getData', (req, res) => {
    //Use mongoose to find data with the given schema
    Data.find((err, data) => {
        console.log(data);
        if (err) {
            return data.json({ success: false, error: err });
        }
    });
    return res.json({ success: true, data: data });
});
//route that will put new information in the database
router.post('/postData', (req, res) => {
    //A new instance of the Mongoose Schema which we will send to the database
    let newData = new Data();
    //pull the ID and message from the body of the request
    const { id, message } = req.body;
    //If id does not have a value and is not equal to 0 or message does not have a value, return an error
    if ((!id && id !== 0) || !message) {
        return res.json({
            success: false,
            error: 'INVALID INPUT'
        })
    }
    //configure the schema object
    newData.id = id;
    newData.message = message;
    //try to save to the database
    newData.save(err => {
        if (err) {
            return res.json({ success: false, error: err });
        }
        return res.json({ success: true });
    })
});
//Route to delete a given object from our database
router.delete('/deleteData', (req, res) => {
    Data.deleteOne({ id: req.body.id }, err => {
        if (err) {
            return res.json({ success: false, error: err });
        } else {
            return res.json({ success: true });
        }
    });
});
//Tell express to use a certain path and to us the routher we set up
app.use('/api', router);
//Tell Express to listed for the requests on the appropriate port
app.listen(API_PORT, () => (console.log('LISTENING ON PORT:' + API_PORT)));

