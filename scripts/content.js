// Content Script for Chrome Extension to copy preview link of Shopify theme


// Documentation: https://developer.chrome.com/extensions/content_scripts



// Shopify URL Button
// Add a button to the page to copy the preview link
function urlButton() {

  // Get the HTML of the document as a string
  var html = document.documentElement.outerHTML;

  // Use a regular expression to find the themeId in the HTML
  // This regular expression looks for a string that starts with "Shopify.theme = "
  // and captures the part that starts with "id": and ends with the next comma
  var idMatch = html.match(/Shopify\.theme = \{"name":"[^"]*","id":(\d+)/);
  // Use a regular expression to find the shop name in the HTML
  // This regular expression looks for a string that starts with "Shopify.shop = "
  // and captures the part enclosed in the double quotes
  var storeUrlMatch = html.match(/Shopify\.shop = "([^"]*)";/);
  // Use a regular expression to find the theme name in the HTML
  // This regular expression looks for a string that starts with "Shopify.theme = "
  // and captures the part that starts with "name": and ends with the next comma
  var storeNameMatch = html.match(/Shopify\.theme = \{"name":"([^"]*)","id":\d+/);
  var themeId;
  var storeUrl;
  var storeName;

  if (idMatch) {
    // If a match was found, the themeId is in the first capture group
    themeId = idMatch[1];
    storeUrl = storeUrlMatch[1];
    storeName = storeNameMatch[1];
  }
  else {
    // If no match was found for the themeId, stop the script
    return;
  }

  // Get the preview bar iframe
  const previewBarIframe = document.querySelector('#preview-bar-iframe');

  // Get the preview link
  const previewLink = `https://${storeUrl}?_fd=0&preview_theme_id=${themeId}`;

  // Get the iframe document
  let iframeDocument = previewBarIframe.contentDocument || previewBarIframe.contentWindow.document;

  // Create the button
  let mobileButton = iframeDocument.createElement('li');
  mobileButton.classList.add('ui-action-list__item');
  mobileButton.innerHTML = `
          <button class="ui-action-list-action" type="button" name="button">
            <span class="ui-action-list-action__text">
              Copy URL
            </span>
          </button>
        `;

  // Create the button
  let button = iframeDocument.createElement('li');
  button.classList.add('ui-button-group__item');

  button.innerHTML = `
          <button class="ui-button admin-bar__button--is-hidden-on-mobile" type="button" name="button">
            Copy URL
          </button>
        `;

  // Create the content to copy to the clipboard
  let content = `
        <a href='${previewLink}'>${storeName}</a>
        `;

  // Add an event listener to the button
  button.onclick = () => {
    copyLinkToClipboard(button, content);
  };

  // Add an event listener to the button
  mobileButton.onclick = () => {
    copyLinkToClipboard(mobileButton, content);
  };

  // Add the button to the page
  let adminButtons = iframeDocument.querySelector('.admin-bar__button-group');
  let mobileAdminButtons = iframeDocument.querySelectorAll('.ui-action-list')[0]

  adminButtons.prepend(button);
  mobileAdminButtons.prepend(mobileButton);


  // Copy the given content to the clipboard
  function copyLinkToClipboard(button, content) {
    const copyListener = event => {
      event.clipboardData.setData('text/plain', content);
      event.clipboardData.setData('text/html', content);
      event.preventDefault();
    };

    document.addEventListener('copy', copyListener);
    document.execCommand('copy');
    document.removeEventListener('copy', copyListener);

    // Change the button text to "Copied!"
    button.querySelector('button').innerHTML = 'Copied!';

    // Change the button text back to "Copy URL" after 2 seconds
    setTimeout(() => {
      button.querySelector('button').innerHTML = 'Copy URL';
    }, 2000);
  }
}

// if 'urlButton' extension settings is set to true on 'chrome.storage', add a button to the page
// Read it using the storage API
chrome.storage.sync.get(['urlButton'], function (items) {
  if (items.urlButton) {

    // Check if the current page is a Shopify page
    const isShopify = document.querySelector('meta[name="shopify-digital-wallet"]');
    if (isShopify) {

      // The element you're waiting for
      var elementSelector = '#preview-bar-iframe';

      // Create a new Mutation Observer instance
      var observer = new MutationObserver(function (mutationsList, observer) {
        // Loop over the mutations that just occured
        for (let mutation of mutationsList) {
          // If the addedNodes property has one or more nodes
          if (mutation.addedNodes.length) {
            var element = document.querySelector(elementSelector);
            if (element) {
              // Element is loaded, you can now run your script
              urlButton();

              // Once the element has loaded, you don't need the observer anymore
              observer.disconnect();
            }
          }
        }
      });

      // Start observing the document with the configured parameters
      observer.observe(document, { childList: true, subtree: true });
    }
  }
});