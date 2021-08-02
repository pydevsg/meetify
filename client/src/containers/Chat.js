import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'

import { addP2pConnection, getPeerMessage , clearPeerMessage, removeP2pConnection, logout} from '../actions'

import ChatBox from './ChatBox'

class Chat extends Component {
	constructor(props){
		super(props);
		this.state = {
			connState: true
		}
		this.peer = '';
		this.localCanvasLoop = '';
		this.remoteCanvasLoop = '';
		this.localStream = '';
		this.remoteStream = '';
		this.local2dContext ='';
		this.remote2dContext = '';
		this.searching = true;
		this.conn = '';
	}

	/*------END PEER CONNECTIONS------*/
	cleanUp(){
		//if there exists a socket connection
		if(this.props.socket){
			//send peer ID to the server side to be removed from the search pool
			this.props.socket.emit('leaveSearch',{ pID:this.peer.id });
			//the peer is no longer searching for a connection
			this.searching = false;
			//close peer connection to server
			this.peer.destroy();
			//remove all socket listeners
			this.props.socket.removeAllListeners('pID');
			//close audio and video streams
			this.localStream.getTracks().forEach( (stream,index) => {
				//end media stream
				stream.stop();
			});

			//destroy canvas loops
			clearInterval(self.localCanvasLoop);
			clearInterval(self.remoteCanvasLoop);
		}
	}

	componentWillUnmount(){
		console.log("Component is Unmounting");
		//end all connections when chat component is unmounted and destroyed
		this.cleanUp();
	}

	componentDidMount() {
		var self = this;
		//canvas for local stream
		this.local2dContext = this.refs.localCanvas.getContext('2d');
		//canvas for remote stream
		this.remote2dContext = this.refs.remoteCanvas.getContext('2d');

		//draws live video stream to canvas
		var streamVideoToCanvas = (vid,ctx)=>{
			ctx.drawImage(vid,0,0,vid.width,vid.height);
		}

		//get webcam permissions
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		//connect to the webcam and create a video stream
		navigator.getUserMedia({video: true, audio: true}, stream => {
			//save stream in constructor
			this.localStream = stream;
			//place the stream in the video src
			this.refs.localStream.src = window.URL.createObjectURL(this.localStream);
		},function(err){
			//throw error if video stream not found
			console.log("Error",err)
		});

		//if the local video is played, draw it to a canvas in a steady stream,
		//this happens behind the scenes
		this.refs.localStream.addEventListener('play',function(){
			//if local video not paused or ended
			if(!this.paused && !this.ended){
				//draw video frame to canvas at a set interval
				self.localCanvasLoop = setInterval(streamVideoToCanvas,10,this,self.local2dContext);
			}
		});

		//if the remote video is played, draw it to a canvas in a steady stream,
		//this happens behind the scenes
		this.refs.remoteStream.addEventListener('play', function(){
			//if local video not paused or ended
			if(!this.paused && !this.ended){
				//draw video frame to canvas at a set interval
				self.remoteCanvasLoop = setInterval(streamVideoToCanvas,10,this,self.remote2dContext);
			}
		});

		//initalize a new peer, 
		//configure all ICE servers for permission to connect two peers
		this.peer = new Peer({
			key:'p73vkga2525fusor',
			config:{'iceServers': [
				{url:'stun:stun01.sipphone.com'},
				{url:'stun:stun.ekiga.net'},
				{url:'stun:stun.fwdnet.net'},
				{url:'stun:stun.ideasip.com'},
				{url:'stun:stun.iptel.org'},
				{url:'stun:stun.rixtelecom.se'},
				{url:'stun:stun.schlund.de'},
				{url:'stun:stun.l.google.com:19302'},
				{url:'stun:stun1.l.google.com:19302'},
				{url:'stun:stun2.l.google.com:19302'},
				{url:'stun:stun3.l.google.com:19302'},
				{url:'stun:stun4.l.google.com:19302'},
				{url:'stun:stunserver.org'},
				{url:'stun:stun.softjoys.com'},
				{url:'stun:stun.voiparound.com'},
				{url:'stun:stun.voipbuster.com'},
				{url:'stun:stun.voipstunt.com'},
				{url:'stun:stun.voxgratia.org'},
				{url:'stun:stun.xten.com'},
			]}
		});

		//connects peer to a remote peer
		this.peer.on('connection', conn => {
			console.log('Connected to other user in p2p connection');
			//saves connection info to redux
			this.props.addP2pConnection(conn);
			//clear peer connection message when the peer is making a new connection
			this.props.clearPeerMessage();
			//peer is attempting to send local video stream to a remote peer
			var call = this.peer.call(conn.peer,this.localStream);
		});

		//peer is answering the call of the remote peer
		this.peer.on('call', call =>{
			//answers call and provides local video stream
			call.answer(this.localStream);
			//remote video stream is received
			call.on('stream', remoteStream => {
				console.log("Got Stream from peer! ");
				//remote video stream is saved in the constructor
				this.remoteStream=remoteStream;
				//show remote stream in canvas element.
				this.refs.remoteStream.src = window.URL.createObjectURL(self.remoteStream);
			});
		});

		//peer is created and assigned a peer ID
		this.peer.on('open', id => {
			console.log("Peer connection open");
			console.log(this.props.socket.id);
			//socket ID and peer ID is passed to the server side
			this.props.socket.emit('pID', {pID:id , sID: this.props.socket.id, available:true} );
  			console.log('My PeerID is:', id);

			//the peer ID of the remote peer is received from the server side
			this.props.socket.on('pID' , pID=>{
				console.log("Im connecting to other user");
				//show connect button and hide disconnect button
				this.setState({connState:true});
				//a connection is made between the local peer and the remote peer
				var conn = this.peer.connect(pID);
				this.conn = conn;
				//peer connection info is received
				conn.on('data', data =>{
					//show connect button and hide disconnect button
					this.setState({connState: true});
					console.log("Got some data of type:", data.type);
					//if peer connection info exists
					switch(data.type){
						case 'peerMessage':
							//store the connection info in redux
							this.props.getPeerMessage(data);
					}
				});

				//if connection between peers is closed
				conn.on('close', ()=> {
					console.log("Data connection is closed");
					//show disconnect button and hide connect button
					this.setState({connState:false});
					//remove connection info from redux
					this.props.removeP2pConnection();
					//send peer ID and socked ID to server side to establish another connection
					if(this.searching)
						this.props.socket.emit('pID', {pID:id , sID: this.props.socket.id, available:true} );
				});
			});
		});
	}

	/*-----LOGOUT-----*/
	logout() {
		//replace the username stored in redux with a null value,
		//this will prevent the user from accessing the video chat page without being authenticated
		this.props.logout(null);
		//clear the user's JWT from local storage
		localStorage.clear();
	}

	/*----DISCONNECT FROM PEER-----*/
	disconnect(){
		//show disconnect button and hide connect button
		this.setState({connState:false});
		//remove peer connection info from redux
		this.props.removeP2pConnection();
		//close the connection to the peer
		this.conn.close();
	}

	/*---RE-ESTABLISH CONNECTION TO A PEER------*/
	reconnect() {
		//refreshes page to call componentDidMount() again,
		//this will force the peer to search for another connection
		window.location.reload(true);
		//show connect button and hide disconnect button
		this.setState({connState:true});
	}

	render(){
    	return(
    		<div id="chatcon">
		    	<div className='chat-wrapper'>
					<div className='video-section'>
						
						<div className="wrapButtons">
							<Link className="logoutBtn" onClick={this.logout.bind(this)} to ="/" >Logout</Link>
							{!this.state.connState && <button className="connect" onClick={this.reconnect.bind(this)}>Connect</button>}
							{this.state.connState && <button className="disconnect" onClick={this.disconnect.bind(this)}>Disconnect</button>}
						</div>
						<div className='videos'>
							<canvas ref='remoteCanvas' className='remoteCanvas' width="320" height="240"></canvas>
						  	<canvas ref='localCanvas' className='localCanvas' width="320" height="240"></canvas>
					  	</div>

				  	</div>
					
					<ChatBox />

		 			<video style={{display:'none'}}  ref="localStream" width="320" height="240" autoPlay muted></video>
		 			<video  style={{display:'none'}} ref="remoteStream" width="320" height="240" autoPlay></video>

		     	</div>
	     	</div>
    	)
  	}
}

/*------BIND REDUX ACTIONS TO COMPONENT--------*/
function matchDispatchToProps(dispatch){
	return bindActionCreators({addP2pConnection, getPeerMessage, clearPeerMessage, removeP2pConnection, logout},dispatch);
}

/*--------BIND REDUX STATES TO COMPONENT------*/
function mapStateToProps(state){
	return { username:state.username, socket:state.socket}
}

export default connect(mapStateToProps,matchDispatchToProps)(Chat)
