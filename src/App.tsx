import * as React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Play } from './views/Play';
import { Wrapper } from "./views/Wrapper";
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

export function App() {
    return (
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
}