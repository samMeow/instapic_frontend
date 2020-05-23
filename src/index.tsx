import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components/macro';
import { Normalize } from 'styled-normalize';

import App from './App';
import configureStore from './store';
import browserHistory from './utils/BrowserHistory';
import * as serviceWorker from './serviceWorker';

import 'react-toastify/dist/ReactToastify.css';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: "Noto Sans TC", Georgia, sans-serif;
  }
`;

configureStore().then((store) => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <Router history={browserHistory}>
          <Normalize />
          <GlobalStyle />
          <App />
        </Router>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
