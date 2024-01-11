document.addEventListener('DOMContentLoaded', function () {
    let port = chrome.runtime.connect({ name: "reportGen" });

    // Listen for responses from the service worker
    port.onMessage.addListener((message) => {
        console.log("Response from service worker:", message);
        if (message.action == 'init') {
            port.postMessage({ action: 'requestData', data: null });
        };
    });
});