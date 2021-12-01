import './Options.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Options from './Options';
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
    <Options />
  </React.StrictMode>,
  document.getElementById('options')
);
