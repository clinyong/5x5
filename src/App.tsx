import * as React from "react";
import { Wrapper } from "./views/Wrapper";
import { HashRouter as Router, Route } from "react-router-dom";

export function App() {
    return (
        <Router>
            <Route path="/" component={Wrapper} />
        </Router>
    );
}