/* eslint-disable no-undef */
// If your extension doesn't need a background script, just leave this file empty

// messageInBackground();

// // This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
// export function messageInBackground() {
//   console.log('I can run your javascript like any other code in your project');
//   console.log('just do not forget, I cannot render anything !');
// }

function getword(info,tab) {
  console.log("Selection " + info.selectionText + " was clicked.");
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, info.selectionText, function(response) {});  
  });
}
// chrome.contextMenus.create({
//   title: "Tally: %s", 
//   contexts:["selection"], 
//   onclick: getword
// });

var parent = chrome.contextMenus.create({"title": "Tally", contexts:["selection"] });
var child1 = chrome.contextMenus.create(
  {"title": "Open", "parentId": parent, "onclick": getword, contexts:["selection"]});
