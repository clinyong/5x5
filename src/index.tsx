import React from 'react';
import ReactDOM from 'react-dom';
import { App } from "./App";
import "./index.scss";

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    require('serviceworker-webpack-plugin/lib/runtime').register();
  }
}

const rootEl = document.getElementById('root');
ReactDOM.render(
  <App />,
  rootEl
);
