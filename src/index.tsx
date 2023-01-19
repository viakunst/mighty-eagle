import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import App from './services/router';
import reportWebVitals from './reportWebVitals';

// App refers to the APP function in de router index.
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
