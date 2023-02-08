// get settings 
chrome.storage.sync.get('urlButton', function (data) {
  document.getElementById('urlButton').checked = data.urlButton;
  document.getElementById('TWDarkTheme').checked = data.TWDarkTheme;
});

// save 'urlButton' to extension settings
document.getElementById('urlButton').addEventListener('change', function () {
  chrome.storage.sync.set({
    urlButton: this.checked
  });
});

// save 'TWDarkTheme' to extension settings
document.getElementById('TWDarkTheme').addEventListener('change', function () {
  chrome.storage.sync.set({
    TWDarkTheme: this.checked
  });
});