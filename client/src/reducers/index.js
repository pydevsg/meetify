import {combineReducers} from 'redux'


const allReducers = combineReducers({

    socket:(state=null, action)=> {
        switch(action.type) {
            case "CONNECT_SOCKET":
                return action.socket;
            }
        return state;
    },

    p2p:(state={conn:null},action)=>{
        switch(action.type){
            case "ADD_P2PCONNECTION":
                return Object.assign({},state,{conn:action.conn});
            case "REMOVE_CONNECTION":
                return Object.assign({},state,{conn:null});
            }
        return state;
    },

    usermail:(state=null,action)=>{
        switch(action.type){
            case "LOGIN":
                return action.usermail
            case "LOGOUT":
                return action.usermail
        }
        return state;
    },

    chatMessages:(state=[],action)=>{
        switch(action.type){
            case "PEER_MESSAGE":
                return [...state, action.message];
            case "CLEAR_PEER_MESSAGE":
                return [];
        }
        return state;
    },

    storage:(state=null, action)=> {
        switch(action.type) {
            case "STORE_LOCAL":
                return state;
        }
        return state;
    },
  
    extract_storage:(state=null, action)=> {
        switch(action.type) {
            case "GET_LOCAL":
                return action.received;
        }
        return null;
    },
});

export default allReducers
