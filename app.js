const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('./config/database');
const users = require('./routes/users');

//connect to database
mongoose.connect(config.database);

//database On connection
mongoose.connection.on('connected',  ()=>{
  console.log('Connected to Database ' + config.database)
})

//error in database connection
mongoose.connection.on('error',  (err)=>{
  console.log('error in database connection ' + err)
})
//object for express
const app = express();

//this is where users.js is present


//port number
const port = process.env.port || 8081 ;

app.use(cors());

//set
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());

//passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/users', users);

app.get('/', (req, res) =>{
    res.send('Hi! This is just a begining');
});

app.get('*', ()=>{
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
   console.log('server started on port ' + port);
})
