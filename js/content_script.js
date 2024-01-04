// content_script.js

// self.addEventListener('message', (event) => {
//   const { action, cssFile } = event.data;

//   if (action === 'injectCSS') {
//     console.log("Got Info to add content")
//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.type = 'text/css';
//     link.href = chrome.extension.getURL(cssFile);

//     document.head.appendChild(link);
//   }
// });


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'injectCSS') {
    // Handle the activation of the tab
    console.log('Tab activated!');
  }
});

// You need to inject content_script.js into the pages where you want to apply the CSS.
