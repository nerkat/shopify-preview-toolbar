// Description: This script is injected into the page and runs in the context of the page. It can access the DOM and make changes to the page.
// Documentation: https://developer.chrome.com/extensions/content_scripts

var isShopify = document.querySelector('meta[name="shopify-digital-wallet"]'); // check if shopify page
if (isShopify) {
  setTimeout(() => {

    const previewUrl = document.querySelector('#preview-bar-iframe').src;
    // load the preview bar url and get data from dom
    fetch(previewUrl)
      .then(response => response.text())
      .then(data => {

        // parse the html and get the theme name and preview link
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, 'text/html');
        const previewLink = htmlDoc.querySelector('#share_theme_url').value;
        const themeName = htmlDoc.querySelector('.ui-type-container.ui-type-container--spacing-extra-tight p strong').innerHTML;


        //create button and add to page
        const buttonURL = document.createElement('a');
        buttonURL.innerHTML = 'Copy URL';
        buttonURL.style = `
        position: fixed;
        bottom: 10px;
        right: 367px;
        z-index: 2147483647;
        color: black;
        padding: 10px;
        border: none;
        cursor: pointer;
        `;

        buttonURL.onclick = () => {
          // copy link to Clipboard
          html2clipboard("<a href='" + previewLink + "'>" + themeName + "</a>");
        };

        document.body.appendChild(buttonURL);

      });

  }, 500);
}

function html2clipboard(content) {
  const copyListener = event => {
    event.clipboardData.setData('text/plain', content);
    event.clipboardData.setData('text/html', content);
    event.preventDefault();
  };

  document.addEventListener('copy', copyListener);
  document.execCommand('copy');
  document.removeEventListener('copy', copyListener);
}


