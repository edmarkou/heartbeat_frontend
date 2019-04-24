import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import LogIn from './pages/LogIn';
import RecoverPass from './pages/RecoverPass';
import Register from './pages/Register';
import Heartbeat from './pages/Heartbeat';
import Messages from './pages/Messages';
import Analysis from './pages/Analysis';

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={Heartbeat}/>
        <Route path="/analysis" exact component={Analysis}/>
        <Route path="/messages" exact component={Messages}/>
        <Route path="/recover" exact component={RecoverPass}/>
        <Route path="/register" exact component={Register}/>
        <Route path="/login" exact component={LogIn}/>
      </Router>
    </div>
  );
}

export default App;
