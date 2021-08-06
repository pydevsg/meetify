# Meetify
Meetify is an online chat + video streaming application to talk with anonymous users along the world. 

## Run Locally

### Frontend:
`cd server && npm start`

### Backend:
`cd client && npm start`

## Tech Stacks:

**_Client Side_**
- [ReactJS](https://reactjs.org/) : For creating UI of the application.
- [Redux](https://react-redux.js.org/) : For state management

**_Server Side_**
- [NodeJS](https://nodejs.org/en/) : For server side rendering
- [ExpressJS]() : Routing & middleware framework
- MongoDB ( [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) ) : For database management system

## Video Calling:
This project doesn't use any external plugins for video calling. Instead, it uses APIs provided by WebRTC standard.
 - A STUN server is used to get public IP address
 - A TURN server is used to relay traffic if direct connection(peer to peer) fails. Currently, 
   free TURN server is used for demonstration. 

   
