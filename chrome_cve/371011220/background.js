chrome.action.onClicked.addListener(() => {
    chrome.storage.local.set({ 'secret': 'slonser' }, () => {
        console.log('Secret set');
    });
});
  