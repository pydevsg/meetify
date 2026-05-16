import {combineReducers} from 'redux'


const allReducers = combineReducers({

    socket:(state=null, action)=> {
        switch(action.type) {
            case "CONNECT_SOCKET":
                return action.socket;
            default:
                return state;
        }
    },

    p2p:(state={conn:null},action)=>{
        switch(action.type){
            case "ADD_P2PCONNECTION":
                return Object.assign({},state,{conn:action.conn});
            case "REMOVE_CONNECTION":
                return Object.assign({},state,{conn:null});
            default:
                return state;
        }
    },

    username:(state=null,action)=>{
        switch(action.type){
            case "LOGIN":
                return action.usermail;
            case "LOGOUT":
                return action.usermail;
            default:
                return state;
        }
    },

    chatMessages:(state=[],action)=>{
        switch(action.type){
            case "PEER_MESSAGE":
                return [...state, action.message];
            case "CLEAR_PEER_MESSAGE":
                return [];
            default:
                return state;
        }
    },

    storage:(state=null, action)=> {
        switch(action.type) {
            case "STORE_LOCAL":
                return state;
            default:
                return state;
        }
    },

    extract_storage:(state=null, action)=> {
        switch(action.type) {
            case "GET_LOCAL":
                return action.received;
            default:
                return null;
        }
    },
});

export default allReducers
