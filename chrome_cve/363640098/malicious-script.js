// Spoof the address bar
window.location.href = '#';

// Add a fake address bar to the page
const fakeAddressBar = document.createElement('div');
fakeAddressBar.style.position = 'fixed';
fakeAddressBar.style.top = '0px';
fakeAddressBar.style.left = '0px';
fakeAddressBar.style.width = '100%';
fakeAddressBar.style.height = '20px';
fakeAddressBar.style.backgroundColor = '#f0f0f0';
fakeAddressBar.style.borderBottom = '1px solid #ccc';
fakeAddressBar.style.padding = '5px';
fakeAddressBar.style.fontSize = '14px';
fakeAddressBar.style.fontFamily = 'Arial, sans-serif';
fakeAddressBar.textContent = '#';
document.body.appendChild(fakeAddressBar);