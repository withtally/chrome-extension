import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ThemeProvider } from 'styled-components';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from './theme';

import { createGlobalStyle } from 'styled-components';

// eslint-disable-next-line no-undef
const montserratFont = chrome.runtime.getURL('fonts/Montserrat-Regular.ttf');
// eslint-disable-next-line no-undef
const montserratFontBold = chrome.runtime.getURL('fonts/Montserrat-Bold.ttf');
// eslint-disable-next-line no-undef
const montserratFontSemiBold = chrome.runtime.getURL('fonts/Montserrat-SemiBold.ttf');

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Montserrat';
    src: local('Montserrat'),
      url(${montserratFont}) format('truetype');
    font-weight: normal;
  }

  @font-face {
    font-family: 'Montserrat';
    src: local('Montserrat'),
      url(${montserratFontSemiBold}) format('truetype');
    font-weight: 600;
  }

  @font-face {
    font-family: 'Montserrat';
    src: local('Montserrat'),
      url(${montserratFontBold}) format('truetype');
    font-weight: bold;
  }

  body, html {
    font-family: 'Montserrat';
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
