const express = require('express')  // middleware
const mongoose = require('mongoose'); //odm 
const app = express();
const http = require("http");
const server = http.createServer(app);
const dotenv = require('dotenv'); 

dotenv.config(); // configuring the .env file variables

const port = process.env.PORT || 5000; //initialsing port
// Routes
const authRoute = require('./routes/auth'); // auth route
const User = require('./models/User'); // connection with database model


//Route Middlewares
app.use('/api/user',authRoute); 
// app.use('/api/post',postRoute);

mongoose.connect(process.env.DB_CONNECT).then(()=>{
    console.log('Database is connected');
    })
    .catch(err =>{
        console.log(err.message);
});


server.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})
