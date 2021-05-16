import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';



//import * as serviceWorker from './serviceWorker';
import firebase from 'firebase'
var firebaseConfig = {
  apiKey: "AIzaSyBfj60VwITE4UQKFnBDqGIqLyKv1KtAnXc",
  authDomain: "websitemanagment-4efda.firebaseapp.com",
  projectId: "websitemanagment-4efda",
  storageBucket: "websitemanagment-4efda.appspot.com",
  messagingSenderId: "690824629146",
  appId: "1:690824629146:web:e5fd902b462e2819edc823",
  measurementId: "G-DLNN98N5C3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
