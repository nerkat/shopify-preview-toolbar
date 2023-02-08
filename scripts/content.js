// Content Script for Chrome Extension to copy preview link of Shopify theme
// Documentation: https://developer.chrome.com/extensions/content_scripts



// Shopify URL Button
// Add a button to the page to copy the preview link
function urlButton() {
  let button;
  // Check if the current page is a Shopify page
  const isShopify = document.querySelector('meta[name="shopify-digital-wallet"]');
  if (isShopify) {

    // Wait for the preview bar to load
    setTimeout(() => {
      const previewBarIframe = document.querySelector('#preview-bar-iframe');
      if (previewBarIframe) {

        const previewUrl = previewBarIframe.src;

        // Fetch the preview bar HTML and extract the preview link and theme name
        fetch(previewUrl)
          .then(response => response.text())
          .then(data => {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            const previewLink = htmlDoc.querySelector('#share_theme_url').value;
            const themeName = htmlDoc.querySelector('.ui-type-container.ui-type-container--spacing-extra-tight p strong').innerHTML;

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
      <span>Theme Name: ${themeName}</span><br>
      <span>Preview Link: <a href='${previewLink}'>${previewLink}</a></span>
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

          });
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
  }

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

// if 'urlButton' extension settings is set to true on 'chrome.storage', add a button to the page
// Read it using the storage API
chrome.storage.sync.get(['urlButton'], function (items) {
  if (items.urlButton) {
    urlButton();
  }
});