/*
=================================================
LISTENER RELATED
=================================================
*/
let pport = null; // port for popup
let rport = null; // port for report

let reportSrc = null;

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
    };

    if (message.action === 'generateSettingPage') {
        //        genHtmlfromJson(message.data);
        chrome.tabs.create({ url: 'reportGen.html' }, function () {
           reportSrc = {action:"skillConfigPage",data:message.data};
        });
        sendResponse({ success: true, data: "Generation Done" });
    }

    if (message.action === 'generateCharacterCard') {
        chrome.tabs.create({ url: 'reportGen.html' }, function () {
           reportSrc = {action:"charCardPage",data:message.data};
        });
        sendResponse({ success: true, data: "Generation Done" });
    }
    // Return true for asynchronous response
    return true;
});

// For Internal Port
chrome.runtime.onConnect.addListener((port) => {
    console.log('connected, port: ' + port.name);

    if (port.name === 'popup') {
        pport = port;
        //Popup
        pport.onMessage.addListener((msg) => {
            console.log("Popup message got ");
            console.log(msg);
        });

        pport.onDisconnect.addListener(
            () => {
                pport = null;
            }
        )
    }

    if (port.name === 'reportGen') {
        rport = port;
        rport.postMessage({ action: 'init', data: null });

        // the init will be sent during page init and then waiting for activel pullin from sub page
        rport.onMessage.addListener((msg) => {
            if (msg.action == 'requestData') {
                rport.postMessage({ action: 'dataInput', data: reportSrc})
            }
        });

        rport.onDisconnect.addListener(
            () => {
                rport = null;
            }
        );
    }
});
