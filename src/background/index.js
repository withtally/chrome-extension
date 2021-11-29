/* eslint-disable no-undef */
function processSelection(info) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, info.selectionText, () => {});
  });
}

const parent = chrome.contextMenus.create({ title: 'Tally', contexts: ['selection'] });
chrome.contextMenus.create({
  title: 'Open',
  parentId: parent,
  onclick: processSelection,
  contexts: ['selection'],
});
