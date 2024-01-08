/*
=================================================
DATA BASE RELATED
=================================================
*/

let db; // Define db globally
let cport = null;

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

function getDataFromStore(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const getRequest = objectStore.get(id);

    getRequest.onsuccess = function (event) {
      const data = event.target.result ? event.target.result.state : null;
      resolve(data);
    };

    getRequest.onerror = function (event) {
      reject(`Error getting data from ${storeName}`);
    };
  });
}

function setDataInStore(db, storeName, id, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const putRequest = objectStore.put({ id: id, state: data });

    putRequest.onsuccess = function () {
      resolve();
    };

    putRequest.onerror = function (event) {
      reject(`Error setting data in ${storeName}`);
    };
  });
}
