import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route } from "react-router-dom";
import { Wrapper } from "./views/Wrapper";
import "./index.scss";

if (process.env.NODE_ENV === "production") {
  if ("serviceWorker" in navigator) {
    require("serviceworker-webpack-plugin/lib/runtime").register();
  }
}

function App() {
  return (
    <Router>
      <Route path="/" component={Wrapper} />
    </Router>
  );
}

const rootEl = document.getElementById("root");
ReactDOM.render(
  <App />,
  rootEl
);
