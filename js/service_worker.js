// service_worker.js

let db; // Define db globally

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('extensionDatabase', 1);

        request.onerror = function (event) {
            reject('Error opening IndexedDB');
        };

        request.onsuccess = function (event) {
            db = event.target.result; // Set db globally
            resolve(db);
        };

        request.onupgradeneeded = function (event) {
            db = event.target.result; // Set db globally
            if (!db.objectStoreNames.contains('extensionState')) {
                const objectStore = db.createObjectStore('extensionState', { keyPath: 'id' });
                objectStore.createIndex('state', 'state', { unique: false });
            }
        };
    });
}

function closeDatabase() {
    if (db) {
        db.close();
    }
}

self.addEventListener('install', (event) => {
    event.waitUntil(openDatabase().then(closeDatabase));
});

self.addEventListener('fetch', (event) => {
    // Handle fetch events if needed
});

self.addEventListener('message', (event) => {
    const { action, data } = event.data;

    if (action === 'getSwitchState') {
        openDatabase()
            .then((db) => getSwitchState(db))
            .then((state) => {
                self.clients.matchAll().then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({ action: 'switchState', data: state });
                    });
                });
            })
            .catch((error) => {
                console.error('Error retrieving switch state:', error);
            })
            .finally(closeDatabase);
    } else if (action === 'setSwitchState') {
        openDatabase()
            .then((db) => setSwitchState(db, data))
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

function getSwitchState(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['extensionState'], 'readonly');
        const objectStore = transaction.objectStore('extensionState');
        const getRequest = objectStore.get(1);

        getRequest.onsuccess = function (event) {
            const state = event.target.result ? event.target.result.state : false;
            resolve(state);
        };

        getRequest.onerror = function (event) {
            reject('Error getting switch state');
        };
    });
}

function setSwitchState(db, state) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['extensionState'], 'readwrite');
        const objectStore = transaction.objectStore('extensionState');
        const putRequest = objectStore.put({ id: 1, state: state });

        putRequest.onsuccess = function () {
            resolve();
        };

        putRequest.onerror = function (event) {
            reject('Error setting switch state');
        };
    });
}

// Listen for tab activation changes
chrome.tabs.onActivated.addListener((activeInfo) => {
    const tabId = activeInfo.tabId;
    openDatabase()
        .then((db) => getSwitchState(db))
        .then((state) => {
            if (state) {
                injectLocalCSSIntoCurrentPage(tabId);
            }
        })
        .finally(closeDatabase);
});

function injectLocalCSSIntoCurrentPage(tid) {
    // Specify the path to the local CSS file within your extension folder
    console.log(tid)
    const cssFile = '/assets/style.css';
    chrome.tabs.sendMessage(tid, { action: 'injectCSS', cssFile: cssFile});

}
