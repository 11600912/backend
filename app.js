//import modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 
const passport = require('passport');
const config = require('./config/database'); 
mongoose.connect(config.database);
//connection to dataabase
mongoose.connection.on('connected', () =>{
    console.log('connected to database'+config.database)
});
//on errror
mongoose.connection.on('error', (err) =>{
    console.log('Database error:'+err);
});


const app =express();

const users = require('./routes/users');
//port number
const port = 3000;
//cors middleware
app.use(cors());
//set static
app.use(express.static(path.join(__dirname,'public')));

//body parser middle ware
app.use(bodyParser.json());
//passport middle ware use passprt.jwt
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users',users);
//index route
app.get('/',(req,res) => {
    res.send('invalid endpoint');
});
//start server
app.listen(port, () => {
    console.log('server start at 3000 port'+port);
});