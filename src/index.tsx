import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Play } from './views/Play';
import { Wrapper } from "./views/Wrapper";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import "./index.scss";

const App = () => (
  <Router>
    <Switch>
      <Route
        path="/play"
        render={({ location }) => {
          return (
            <ReactCSSTransitionGroup
              transitionName="play"
              transitionEnterTimeout={350}
              transitionLeaveTimeout={350}
              transitionAppear={true}
              transitionAppearTimeout={350}
            >
              {
                React.cloneElement(
                  <Route
                    location={location}
                    path="/play"
                    component={Play}
                    key={location.key}
                  />
                )
              }
            </ReactCSSTransitionGroup>
          )
        }}
      />
      <Route path="/" component={Wrapper} />
    </Switch>
  </Router>
)

const rootEl = document.getElementById('root');
ReactDOM.render(
  <App />,
  rootEl
);
