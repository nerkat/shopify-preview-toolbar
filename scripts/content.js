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

  let button;
  // Check if the current page is a Shopify page
  const isShopify = document.querySelector('meta[name="shopify-digital-wallet"]');
  if (isShopify) {

    // Wait for the preview bar to load
    setTimeout(() => {
      const previewBarIframe = document.querySelector('#preview-bar-iframe');
      if (previewBarIframe) {


        const previewLink = `https://${storeUrl}?_fd=0&preview_theme_id=${themeId}`;

        // Create a "Copy URL" button and add it to the page
        button = document.createElement('a');
        button.innerHTML = 'Copy URL';
        button.id = 'copy-url';
        button.style = `
          position: fixed;
          bottom: 12px;
          font-weight: bold;
          right: 362px;
          z-index: 2147483647;
          cursor: pointer;
          text-align: center;
          font-size: 13px;
          border-radius: 4px;
          padding: 6px 18px;
          color: rgb(0, 128, 96);
          border: 1px solid #BABFC3;
          background: white;
      `;

        let content = `
            <a href='${previewLink}'>${storeName}</a>
            `;

        button.onclick = () => {
          copyLinkToClipboard(content);
        };

        document.body.appendChild(button);

        const css = `
                    @media (max-width: 784px) {
                      #copy-url {
                        bottom: 27px !important;
                        right: 145px !important;
                      }
                    }
                    `;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);

        // watch for changes in the preview bar iframe 'style'
        // if the preview bar is closed, remove the button
        const observer = new MutationObserver(() => {
          if (previewBarIframe.style.display === 'none') {
            button.remove();
          }
        });
        observer.observe(previewBarIframe, {
          attributes: true,
          attributeFilter: ['style']
        });
      }
    }, 500);

    // Copy the given content to the clipboard
    function copyLinkToClipboard(content) {
      const copyListener = event => {
        event.clipboardData.setData('text/plain', content);
        event.clipboardData.setData('text/html', content);
        event.preventDefault();
      };

      document.addEventListener('copy', copyListener);
      document.execCommand('copy');
      document.removeEventListener('copy', copyListener);

      // Change the button text to "Copied!"
      button.innerHTML = 'Copied!';

      // Change the button text back to "Copy URL" after 2 seconds
      setTimeout(() => {
        button.innerHTML = 'Copy URL';
      }, 2000);
    }
  };
}

// if 'urlButton' extension settings is set to true on 'chrome.storage', add a button to the page
// Read it using the storage API
chrome.storage.sync.get(['urlButton'], function (items) {
  if (items.urlButton) {
    urlButton();

  }
});