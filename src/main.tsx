import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from './views/Home';
import { Router, Route, Link, browserHistory } from 'react-router';

const App = () => (
  <Router history={browserHistory}>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <Route path="/home" component={Home} />
    </div>
  </Router>
)

const rootEl = document.getElementById('root');
ReactDOM.render(
  <App />,
  rootEl
);
