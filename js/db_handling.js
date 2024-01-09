function getDataFromStore(storeName, id, defaultValue) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(`${storeName}_${id}`, (result) => {
            const data = result[`${storeName}_${id}`];
            // Check if the key exists
            if (data !== undefined) {
                resolve(data);
            } else {
                // Key does not exist, return default value
                resolve(defaultValue);
            }
        });
    });
}

function setDataInStore(storeName, id, data) {
    return new Promise((resolve, reject) => {
        const storageData = {};
        storageData[`${storeName}_${id}`] = data;
        chrome.storage.local.set(storageData, () => {
            resolve();
        });
    });
}
