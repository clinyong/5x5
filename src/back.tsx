import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Play } from './views/Play';
import { Wrapper } from "./views/Wrapper";
import { HashRouter as Router, Route } from 'react-router-dom';
import "./index.scss";

const App = () => (
    <Router>
        <Route
            render={({ location }) => {
                return (
                    <div>
                        <Route path="/" component={Wrapper} />

                        <div>
                            <ReactCSSTransitionGroup
                                transitionName="play"
                                transitionEnterTimeout={300}
                                transitionLeaveTimeout={300}
                            >
                                <Route
                                    location={location}
                                    key={'pplay'}
                                    path="/play"
                                    component={Play}
                                />
                            </ReactCSSTransitionGroup>
                        </div>
                    </div>
                )
            }}
        />
    </Router>
)

const rootEl = document.getElementById('root');
ReactDOM.render(
    <App />,
    rootEl
);
