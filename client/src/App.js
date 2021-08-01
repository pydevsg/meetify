import './App.css';
import Login from './components/loginForm';
import Register from './components/registerForm';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
       <Switch>
         <Route exact path = "/"><Login/></Route>
         <Route path = "/register"><Register/></Route>
       </Switch>
      </Router>
    </div>
  );
}

export default App;
