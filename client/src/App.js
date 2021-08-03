import './App.css';
import {Router, Route} from "react-router";
import React from 'react'


import { createBrowserHistory } from 'history';
import {Provider} from 'react-redux'
import { createStore } from 'redux'

import allReducers from './reducers'

import Home from './containers/Home'
import Chat from './containers/Chat'

const store = createStore(allReducers);

const history = createBrowserHistory();

/*-----AUTHENTICATE USER ROUTES-------*/
function authenticateUser(nextState, replace){
    //get redux store
    var state = store.getState();
    //if there is not socket connection or username is null,
    //prevent the user from accessing video chat page
    if(!state.socket || !state.username)
        replace("/");
}
function App() {
  return (
    <div className="App">
      <Provider store={store}>
    <Router history = {history}>
      <Route path='/' component= { Home }></Route>
      <Route path='/chat' onEnter={ authenticateUser } component={ Chat } />
    </Router>
  </Provider>
    </div>
  );
}

export default App;
