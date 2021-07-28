const express = require('express')  // middleware
const mongoose = require('mongoose'); //odm 
const app = express();
const http = require("http");
const server = http.createServer(app);
const dotenv = require('dotenv'); 
const socketIO = require('socket.io');

dotenv.config(); // configuring the .env file variables

const port = process.env.PORT || 5000; //initialising port

// Route
const authRoute = require('./routes/auth'); // auth route

const User = require('./models/User'); // connection with database model


//Route Middlewares
app.use('/api/user',authRoute); 

//initialize socket IO
const io = socketIO(server);


// SearchPool - To store all the peers until an established connection is made
var SearchPool = function() {
	this.searching = {};
	this.timeouts = {};
}

//the peer will alternate between active search mode and passive search mode,
//alternating will ensure that the peer does not sit too long in the search pool
SearchPool.prototype = {
	constructor: SearchPool,
	//checks to see if the pool is empty
	isEmpty: function(){
		if( _.isEmpty(this.searching) ) return true;
		else return false;
	},
	//active search means that a peer is looking through the search pool for an available connection 
	activeSearch:function(user){
		console.log("Trying active search for pID:", user.pID);
		//if search pool is not empty
		if(!this.isEmpty()){
			//iterate through the search pool
			_.forEachRight(this.searching , (value,key) =>{
				//if another peer is free
				if(value.available){
					//set value to false to show that peer is no longer available
					value.available = false;
					//emit the local peer as well as the remote peer's ID to the front end to establish a connection
					io.to(user.sID).emit("pID", value.pID);
					io.to(value.sID).emit("pID", user.pID);
					//remove remote peer from the search pool
					delete this.searching[key];
					//the remote peer was waiting in the search pool for a connection to be established,
					//timeout is cleared to prevent the peer from re-entering active search mode
					clearTimeout(this.timeouts[key]);
					return ;
				}
			});
		}
		//if the search pool is empty,
		//add the peer into the pool
		else{
			this.passiveSearch(user);
		}
	},
	//passive search means the peer is sitting in the search pool waiting for an connection to be made
	passiveSearch:function(user){
		console.log("Trying passive search for pID:",user.pID);
		//the peer is placed inside the search pool
		this.searching[user.pID] = user;
		this.timeouts[user.pID] = setTimeout( ()=>{
			delete this.searching[user.pID];
			this.activeSearch(user);
		} , 5000)
	},
	//removes peer from the search pool
	removeUser(userPID){
		//timeout is cleared to prevent the peer from re-entering the search pool
		clearTimeout(this.timeouts[userPID]);
		//remove peer
		delete this.searching[userPID];
	}

}

//object used to store all peers waiting to establish a connection
var globalPool = new SearchPool();

//create a new socket connection
io.on('connection', function(socket) {
	console.log("Socket connected, id:", socket.id);
	console.log("All sockets:", Object.keys(io.sockets.connected) );

	//receives the peer ID from the front-end
	socket.on('pID', function(data){
		console.log("Received pID", data.pID);
		//enters active search mode
		globalPool.activeSearch(data);
		console.log('Global Pool:\n',globalPool.searching);
		socket.pID = data.pID;
	});

	//when the socket is disconnected
	socket.on('disconnect',function(){
		console.log('Socket ID:',socket.id,'DISCONNECTED');
		console.log("All sockets:", Object.keys(io.sockets.connected) );
		//if there exists a socket connection
		if(socket.pID){
			//removes peer from the search pool
			globalPool.removeUser(socket.pID);
		}
	});

	//removes peer from the search pool
	socket.on('leaveSearch',function(){
		//if there exists a socket connection
		if(socket.pID){
			//removes peer from the search pool
			globalPool.removeUser(socket.pID);
		}
	});
});

// establish connection with database
mongoose.connect(process.env.DB_CONNECT).then(()=>{
    console.log('Database is connected');
    })
    .catch(err =>{
        console.log(err.message);
});

server.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})
