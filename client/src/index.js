import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {store} from './reducers';
import {Provider} from 'react-redux';
import axios from 'axios';

var port = 5000;
axios.defaults.baseURL = window.location.protocol + '//' + window.location.hostname + ':' + port;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);