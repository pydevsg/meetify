import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import React from 'react'

import { Provider, useSelector } from 'react-redux'
import { createStore } from 'redux'

import allReducers from './reducers'

import Home from './containers/Home'
import Chat from './containers/Chat'

const store = createStore(allReducers);

function PrivateRoute({ component: Component, ...rest }) {
  const socket = useSelector(state => state.socket);
  const username = useSelector(state => state.username);

  return (
    <Route
      {...rest}
      render={props =>
        socket && username ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

function AppRoutes() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <PrivateRoute path='/chat' component={Chat} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </div>
  );
}

export default App;
