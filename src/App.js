import React from 'react';
import './App.css';
import {
  BrowserRouter as Router, Route,
} from "react-router-dom";
import { Home } from './components/home/Home';
import { Game } from './components/board/Board';

function App() {
  return (
    <Router>
      <div className="App">
        <Route component={Home} path='/' exact />
        <Route component={Game} path='/game' />
      </div>
    </Router>
  );
}

export default App;
