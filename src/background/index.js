/* eslint-disable no-undef */
import ApolloClient from 'apollo-boost';
import { gql } from '@apollo/client';

const { REACT_APP_BITQUERY_KEY } = process.env;

var client = new ApolloClient({
  headers: {
    'X-API-KEY': `${REACT_APP_BITQUERY_KEY}`,
  },
  uri: 'https://graphql.bitquery.io',
});

const BALANCE_QUERY = gql`
  query ($address: String!) {
    ethereum {
      address(address: { is: $address }) {
        balances {
          currency {
            symbol
            tokenType
            name
          }
          value
        }
      }
    }
  }
`;

function processSelection(info) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: 'selection-text', payload: info.selectionText },
      () => {}
    );
  });
}

const parent = chrome.contextMenus.create({ title: 'Tally', contexts: ['selection'] });
chrome.contextMenus.create({
  title: 'Open',
  parentId: parent,
  onclick: processSelection,
  contexts: ['selection'],
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'bitquery-address') {
    client
      .query({
        query: BALANCE_QUERY,
        variables: {
          address: request.address,
        },
      })
      .then((results) => {
        // Send it to tally popup
        // console.log('Balances: ', results);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              type: 'bitquery-response',
              payload: { address: request.address, data: results.data },
            },
            () => {}
          );
        });
      })
      .catch((err) => console.error(err));
  }

  sendResponse();
});
