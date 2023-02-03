// Content Script for Chrome Extension to copy preview link of Shopify theme
// Documentation: https://developer.chrome.com/extensions/content_scripts

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
          button.style = `
          position: fixed;
          bottom: 11px;
          font-weight: bold;
          right: 358px;
          z-index: 2147483647;
          border: none;
          cursor: pointer;
          text-align: center;
          font-size: 14px;
          border-radius: 4px;
          padding: 6px 10px;
          color: rgb(0 128 96);
      `;

          let content = `
      <span>Theme Name: ${themeName}</span><br>
      <span>Theme Preview Link: <a href='${previewLink}'>${previewLink}</a></span>
      `;

          button.onclick = () => {
            copyLinkToClipboard(content);
          };

          document.body.appendChild(button);
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