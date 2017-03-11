import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from './views/Home';
import { Sync } from './views/Sync';
import { Setting } from './views/Setting';
import { Wrapper } from "./components/Wrapper";
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import "./index.scss";

const App = () => (
  <Router history={hashHistory}>
    <Route path="/" component={Wrapper}>
      <IndexRoute component={Home} />
      <Route path="home" component={Home} />
      <Route path="sync" component={Sync} />
      <Route path="setting" component={Setting} />
    </Route>
  </Router>
)

const rootEl = document.getElementById('root');
ReactDOM.render(
  <App />,
  rootEl
);
