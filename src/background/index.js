/* eslint-disable no-undef */
function processSelection(info) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: 'selection-text', payload: info.selectionText },
      () => {}
    );
  });
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({ id: 'tally-menu', title: 'Tally', contexts: ['selection'] });
  chrome.contextMenus.create({
    id: 'tally-open',
    title: 'Open',
    parentId: 'tally-menu',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'tally-open') {
    processSelection(info);
  }
});
