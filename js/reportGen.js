document.addEventListener('DOMContentLoaded', function () {
    let port = chrome.runtime.connect({ name: "reportGen" });

    // Listen for responses from the service worker
    port.onMessage.addListener((message) => {
        console.log("Response from service worker:", message);
        //Initial Request
        if (message.action == 'init') {
            console.log("Request Data for page Generation")
            port.postMessage({ action: 'requestData', data: null });
        };

    });
});