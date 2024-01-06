// service_worker.js

/*
=================================================
DATA BASE RELATED
=================================================
*/

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

/*
=================================================
TAB DETECT & INJECTION RELATED
=================================================
*/

// Listen for tab activation changes
//chrome.tabs.onActivated.addListener(async (activeInfo) => {
//const tabId = activeInfo.tabId;
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    //Only react after load done
    if (changeInfo.status === 'complete') {
        //Firstly to check if the tabID had already injected by message
        // To send one message to this tab.
        await handleTab()
            .then((tabinfo) => {
                if (tabinfo.isAllowed == false) {
                    return;
                }
                console.debug("Valid WoD:", tabinfo.url);
                openDatabase()
                    .then((db) => getSwitchState(db))
                    .then((state) => {
                        if (state) {
                            injectLocalFileIntoCurrentPage(tabId, tabinfo.url);
                        }
                    })
                    .finally(closeDatabase);
            });
    } else if (changeInfo.status === 'loading') {
        //Firstly to check if the tabID had already injected by message
        // To send one message to this tab.
        await handleTab()
            .then((tabinfo) => {
                if (tabinfo.isAllowed == false) {
                    return;
                }
                console.debug("Valid WoD:", tabinfo.url);
                openDatabase()
                    .then((db) => getSwitchState(db))
                    .then((state) => {
                        if (state) {
                            injectLocalIDLEFileIntoCurrentPage(tabId, tabinfo.url);
                        }
                    })
                    .finally(closeDatabase);
            });
    }
});

function injectLocalIDLEFileIntoCurrentPage(tid, url) {
    // Specify the path to the local CSS file within your extension folder
    let cssfileurl = [];
    let scriptfileurl = [];
    // Baseline for common CSS & JS

    cssfileurl.push("/assets/css/wodcss/empty.css");
    chrome.scripting.insertCSS({ target: { tabId: tid }, files: cssfileurl })
        .then(() => console.debug("CSS injected"))
        .finally(() => console.debug("All Injection Finished!"))
};


function injectLocalFileIntoCurrentPage(tid, url) {
    // Specify the path to the local CSS file within your extension folder
    let cssfileurl = [];
    let scriptfileurl = [];
    // Baseline for common CSS & JS

    scriptfileurl.push("/js/jquery-3.7.1.min.js");
    scriptfileurl.push("/js/wodjs/content_script.js");

    // Plugin Files:
    scriptfileurl.push("/js/wodjs/plugin_jumper.js");
    scriptfileurl.push("/js/wodjs/plugin_price.js");


    cssfileurl.push("/assets/css/wodcss/wod.css");

    // Page Handling differently
    // TRADE
    if (url.indexOf("trade.php") > 0) {
        cssfileurl.push("/assets/css/wodcss/wodTrade.css");
    };

    // REPORT
    if (url.indexOf("report") > 0) {
        scriptfileurl.push("/js/wodjs/report.js");
        cssfileurl.push("/assets/css/wodcss/wodReport.css");
    };

    // REPORT
    if (url.indexOf("pm") > 0) {
        cssfileurl.push("/assets/css/wodcss/wodPM.css");
    };


    // NON-FORUM
    if (url.indexOf("viewtopic") < 0) {
        cssfileurl.push("/assets/css/wodcss/nonWodForum.css");
    };


    chrome.scripting.executeScript({ target: { tabId: tid }, files: scriptfileurl, })
        .then(() => {
            chrome.scripting.insertCSS({ target: { tabId: tid }, files: cssfileurl })
            console.debug("Script injected on target: ", scriptfileurl);
            console.debug("CSS injected on target: ", cssfileurl);
        })
        .then(() => console.debug("CSS injected"))
        .finally(() => console.debug("All Injection Finished!"))
};

async function handleTab() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            const activeTab = tabs[0];
            if (activeTab && activeTab.url) {
                const url = activeTab.url;
                // Now you can use the URL as needed
                const isAllowed = isAllowedDomain(url);
                resolve({ url: url, isAllowed: isAllowed });
            }
        });
    });
};

function isAllowedDomain(url) {
    const allowedHostPattern = /^http.*:\/\/.*\.world-of-dungeons\.org\/.*/;
    return allowedHostPattern.test(url);
};
