// get settings 
chrome.storage.sync.get('urlButton', function (data) {
  document.getElementById('urlButton').checked = data.urlButton;
});

// save 'urlButton' to extension settings
document.getElementById('urlButton').addEventListener('change', function () {
  chrome.storage.sync.set({
    urlButton: this.checked
  });
});