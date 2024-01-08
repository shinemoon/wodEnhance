/*
=================================================
LISTENER RELATED
=================================================
*/
self.addEventListener('install', (event) => {
    //Initializaton of DB during installation
    event.waitUntil(openDatabase().then(closeDatabase));
});

/*
self.addEventListener('fetch', (event) => {
    // Handle fetch events if needed
});
*/

self.addEventListener('message', (event) => {
    const { action, data } = event.data;

    console.debug("Got Message: ", action);

    if (action === 'getSwitchState') {
        openDatabase()
            .then((db) => getDataFromStore(db,'extensionState',1))
            .then((state) => {
                self.clients.matchAll().then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({ action: 'extensionState', data: state });
                    });
                });
            })
            .catch((error) => {
                console.error('Error retrieving switch state:', error);
            })
            .finally(closeDatabase);
    } else if (action === 'setSwitchState') {
        openDatabase()
            .then((db) => setDataInStore(db, 'extensionState',1, data))
            .then(() => {
                self.clients.matchAll().then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({ action: 'switchStateUpdated' });
                    });
                });
            })
            .catch((error) => {
                console.error('Error setting switch state:', error);
            })
            .finally(closeDatabase);
    }
});


// For Chrome.runtime.onMessage
// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'calculateStr') {
        sendResponse({ success: true, data: calculateExpression(message.data) });
        //        cport.postMessage("One Request Coming")
    }
    //Return True for async return
    return true;
});

//For Internal Port
chrome.runtime.onConnect.addListener((port) => {
    console.log('connected')
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
