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
                    .then((db) => getDataFromStore(db, 'extensionState', 1))
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
                    .then((db) => getDataFromStore(db, 'extensionState', 1))
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


    let pluginscriptfileurl = [];

    //Please not the order of script/css!

    // Baseline for common CSS & JS
    scriptfileurl.push("/js/jquery-3.7.1.min.js");
    // Final Mockup
    scriptfileurl.push("/js/wodjs/content_script.js");

    // Plugin Files:
    pluginscriptfileurl.push("/js/wodjs/plugin_jumper.js");
    pluginscriptfileurl.push("/js/wodjs/plugin_price.js");
    pluginscriptfileurl.push("/js/wodjs/plugin_extra_statistics.js");
    pluginscriptfileurl.push("/js/wodjs/plugin_skillrolls.js");
    pluginscriptfileurl.push("/js/wodjs/plugin_bbcode_generate.js");

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
    // SKILLCONFIG
    if (url.indexOf("skillconfig") > 0 || url.indexOf("hero/skillconf")>0) {
        scriptfileurl.push("/js/wodjs/skill_config.js");
        cssfileurl.push("/assets/css/wodcss/wodSkillConf.css");
    };


    // PM
    if (url.indexOf("pm") > 0) {
        cssfileurl.push("/assets/css/wodcss/wodPM.css");
    };
    // Item 
    if (url.indexOf("items.php") > 0) {
        cssfileurl.push("/assets/css/wodcss/wodItem.css");
    };



    // NON-FORUM
    if (url.indexOf("viewtopic") < 0) {
        cssfileurl.push("/assets/css/wodcss/nonWodForum.css");
    };

    cssfileurl.push("/assets/css/wodcss/plugin/plugin_skillrolls.css");

    //Reverse script/css lists

    chrome.scripting.executeScript({ target: { tabId: tid }, files: scriptfileurl, })
        .then(() => {
            chrome.scripting.insertCSS({ target: { tabId: tid }, files: cssfileurl })
            console.debug("Script injected on target: ", scriptfileurl);
            console.debug("CSS injected on target: ", cssfileurl);
        })
        .then(() => console.debug("CSS injected"))
        .finally(() => {
            console.debug("All Injection Finished!");
            console.debug("Start Plugin Injection!");
            chrome.scripting.executeScript({ target: { tabId: tid }, files: pluginscriptfileurl, })
                .then(() => console.log("Plugin Injected:",pluginscriptfileurl))
                .catch((error) => console.error(`Plugin Injection failure:${error.message}`))
        })
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
