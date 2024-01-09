/*
=================================================
LISTENER RELATED
=================================================
*/
self.addEventListener('install', (event) => {
    // Initialization during installation (using local storage)
    // No need to open or close anything
});

self.addEventListener('message', (event) => {
    const { action, data } = event.data;

    console.debug("Got Message: ", action);

    if (action === 'getSwitchState') {
        getDataFromStore('extensionState', 1, false)
            .then((state) => {
                console.log(state);
                self.clients.matchAll().then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({ action: 'extensionState', data: state });
                    });
                });
            })
            .catch((error) => {
                console.error('Error retrieving switch state:', error);
            });
    } else if (action === 'setSwitchState') {
        setDataInStore('extensionState', 1, data)
            .then(() => {
                self.clients.matchAll().then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({ action: 'switchStateUpdated' });
                    });
                });
            })
            .catch((error) => {
                console.error('Error setting switch state:', error);
            });
    }
});

// For chrome.runtime.sendMessage
// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'calculateStr') {
        sendResponse({ success: true, data: calculateExpression(message.data) });
    }
    // Return true for asynchronous response
    return true;
});

// For Internal Port
chrome.runtime.onConnect.addListener((port) => {
    console.log('connected');
    console.assert(port.name === "popup");
    cport = port;
    console.log('port');
    console.log(cport);
    port.onMessage.addListener((msg) => {
        if (msg.action === "executeResult") {
            // Handle the message and send a response if needed
            port.postMessage({ result: "Message received and processed." });
        }
    });
});
