const login = (usermail) => {
	return {
		type: "LOGIN",
		usermail
	}
}

const logout = (usermail) => {
	return {
		type:"LOGOUT",
		usermail
	}
}

const connectSocket = (socket) => {
	return {
		type:"CONNECT_SOCKET",
		socket
	}
}

const addP2pConnection = (conn) => {
	return {
		type: "ADD_P2PCONNECTION" ,
		conn
	}
}

const removeP2pConnection = () => {
	return {
		type: "REMOVE_CONNECTION"
	}
}

const getPeerMessage = (message) => {
	return{
		type:'PEER_MESSAGE',
		message
	}
}

const clearPeerMessage = () => {
	return {
		type: 'CLEAR_PEER_MESSAGE'
	}
}

const storeLocally = (password, usermail) => {
	//create user object
	var userInfo = {
        token:password,
        usermail:usermail
    }

    //serialize the object for storage
    const serializedState = JSON.stringify(userInfo);
      
    //store JWT in user's local storage
    localStorage.setItem('token', serializedState);

	return {
		type: 'STORE_LOCAL',
		usermail
	}
}

const extractStorage = () => {
	//retrieve JWT from user's local storage
	const received = JSON.parse(localStorage.getItem('token'));
	
	return {
		type: 'GET_LOCAL',
		received
	}
}

export {
  login,
  connectSocket,
  addP2pConnection,
  removeP2pConnection,
  getPeerMessage,
  clearPeerMessage,
  storeLocally,
  extractStorage,
  logout
}
