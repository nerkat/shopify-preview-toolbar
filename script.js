    // get and set 'urlButton' according to extention settings
    chrome.storage.sync.get('urlButton', function (data) {
        document.getElementById('urlButton').checked = data.urlButton;
      });
  
      // save 'urlButton' to extention settings
      document.getElementById('urlButton').addEventListener('change', function () {
        chrome.storage.sync.set({
          urlButton: this.checked
        });
      });