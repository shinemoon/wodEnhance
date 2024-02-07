/*
=================================================
TAB DETECT & INJECTION RELATED
=================================================
*/

let darkMode = false;

// Listen for tab activation changes
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading') {
        var curId = tabId
        await handleTab(curId)
            .then((tabinfo) => {
                if (tabinfo.isAllowed == false) {
                    return;
                }
                console.debug("Valid WoD:", tabinfo.url);
                getDataFromStore('extensionState', 1, { onoff: false, night: false })
                    .then((state) => {
                        if (state['onoff']) {
                            darkMode = state['night'];
                            injectLocalFileIntoCurrentPage(curId, tabinfo.url);
                        }
                    });
            });
    }
});

function injectLocalIDLEFileIntoCurrentPage(tid, url) {
    // Specify the path to the local CSS file within your extension folder
    let cssfileurl = [];
    // Baseline for common CSS & JS
    cssfileurl.push("/assets/css/wodcss/empty.css");
    chrome.scripting.insertCSS({ target: { tabId: tid }, files: cssfileurl })
        .then(() => console.debug("CSS injected"))
        .finally(() => console.debug("All Injection Finished!"))
}

function injectLocalFileIntoCurrentPage(tid, url) {
    // Specify the path to the local CSS file within your extension folder
    let cssfileurl = [];
    let scriptfileurl = [];


    let pluginscriptfileurl = [];

    //Please not the order of script/css!

    // Baseline for common CSS & JS
    scriptfileurl.push("/js/jquery-3.7.1.min.js");
    scriptfileurl.push("/js/wodjs/content_script.js");
    // Final Mockup
   scriptfileurl.push("/js/wodjs/plugin_bbcode_generate.js");

    // Plugin Files:
    // NOTE: some plugin is important and reused in some other script. which will be moved to previous js array. i.e. bbcode_generate, skillrolls.
    pluginscriptfileurl.push("/js/wodjs/wod_standard.js");
    pluginscriptfileurl.push("/js/wodjs/plugin_jumper.js");
    pluginscriptfileurl.push("/js/wodjs/plugin_price.js");
    pluginscriptfileurl.push("/js/wodjs/plugin_extra_statistics.js");
    pluginscriptfileurl.push("/js/wodjs/plugin_skillrolls.js");

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
    if (url.indexOf("skillconfig") > 0 || url.indexOf("hero/skillconf") > 0) {
        scriptfileurl.push("/js/wodjs/skill_config.js");
        cssfileurl.push("/assets/css/wodcss/wodSkillConf.css");
    };
    // PM
    if (url.indexOf("pm") > 0) {
        scriptfileurl.push("/js/wodjs/pm.js");
        cssfileurl.push("/assets/css/wodcss/wodPM.css");
    };
    // Item 
    if (url.indexOf("items.php") > 0 || url.indexOf("trade.php") > 0) {
        cssfileurl.push("/js/jqplugin/nice-select/nice-select2.css");
        cssfileurl.push("/assets/css/wodcss/wodItem.css");
        pluginscriptfileurl.push("/js/jqplugin/nice-select/nice-select2.js");
        pluginscriptfileurl.push("/js/wodjs/plugin_market.js");
    };
    // Gear!
    // 搭积木！
    if (url.indexOf("hero/items.php?view=gear") > 0 ) {
        scriptfileurl.push("/js/wodjs/gear.js");
    };

    if (url.indexOf("csvexport.php") > 0) {
        pluginscriptfileurl.push("/js/wodjs/plugin_market.js");
    }
    // Item 
    if (url.indexOf("hero/profile.php") > 0) {
        cssfileurl.push("/assets/css/wodcss/wodProfile.css");
        scriptfileurl.push("/js/wodjs/profile_get_attribute.js");
        scriptfileurl.push("/js/wodjs/profile_get_skills.js");
        scriptfileurl.push("/js/wodjs/profile_get_gears.js");
        scriptfileurl.push("/js/wodjs/profile.js");
    };

    if (url.indexOf("hero/skill") > 0) {
        cssfileurl.push("/assets/css/wodcss/plugin/plugin_skillrolls.css");
    }


    if (url.indexOf("spiel/forum") > 0) {
        //        cssfileurl.push("/assets/css/wodcss/wodForum.css");
    };

    // NON-FORUM
    if (url.indexOf("spiel/forum") < 0) {
        cssfileurl.push("/assets/css/wodcss/nonWodForum.css");
    };

    console.log(darkMode);
    if (darkMode)
        scriptfileurl.push("/js/wodjs/set_dark.js");
    else
        scriptfileurl.push("/js/wodjs/set_light.js");
 
    // Fetch and input parameter into page

    chrome.scripting.executeScript({ target: { tabId: tid }, files: scriptfileurl, world: "ISOLATED" })
        .then(() => {
            if (cssfileurl.length > 0) {
                chrome.scripting.insertCSS({ target: { tabId: tid }, files: cssfileurl })
                console.debug("CSS injected on target: ", cssfileurl);
            }
            console.debug("Script injected on target: ", scriptfileurl);
        })
        .then(() => console.debug("CSS injected"))
        .finally(() => {
            console.debug("All Injection Finished!");
            console.debug("Start Plugin Injection!");
            chrome.scripting.executeScript({ target: { tabId: tid }, files: pluginscriptfileurl, world: "ISOLATED" })
                .then(() => console.log("Plugin Injected:", pluginscriptfileurl))
                .catch((error) => console.error(`Plugin Injection failure:${error.message}`))
        })
}

async function handleTab(tabId) {
    return new Promise((resolve) => {
        //chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        // const activeTab = tabs[0];
        chrome.tabs.get(tabId, async (tabs) => {
            const activeTab = tabs;
            if (activeTab && activeTab.url) {
                const url = activeTab.url;
                const isAllowed = isAllowedDomain(url);
                resolve({ url: url, isAllowed: isAllowed });
            }
        });
    });
}

function isAllowedDomain(url) {
    const allowedHostPattern = /^http.*:\/\/.*\.world-of-dungeons\.org\/.*/;
    return allowedHostPattern.test(url);
}
