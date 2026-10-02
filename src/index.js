import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@fontsource/manrope';
import App from './App';
import { BrowserRouter as Router} from 'react-router-dom';
import { ScrollToTop } from './components';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <ScrollToTop/>
    <App />
  </Router>
);
