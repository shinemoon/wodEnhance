//document.addEventListener('DOMContentLoaded', function () {
var debug = true;
$(document).ready(function () {
    console.log('Load ReportGen');
    if (debug) {
        loadLocalJSON(data => {
            genPage({
                action: 'equipSimulatorPage',
                data: data
            });
        })
    } else if (typeof port === 'undefined') {
        const port = chrome.runtime.connect({ name: "reportGen" });
        // Listen for responses from the service worker
        port.onMessage.addListener((message) => {
            console.log("Response from service worker:", message);
            //Initial Request
            if (message.action == 'init') {
                console.log("Request Data for page Generation")
                port.postMessage({ action: 'requestData', data: null });
            } else if (message.action == 'dataInput') {
                genPage(message.data);
            }
        });
    }
    // Close popup when the close button is clicked
    $("#closePopup").click(function () {
        $("#popupOverlay").fadeOut();
    });
});

function genPage(dat) {

    if (dat.action == 'skillConfigPage') {
        genSkillSetPage(dat.data);
    }
    if (dat.action == 'charCardPage') {
        genCardPage(dat.data);
    }
    if (dat.action == 'libItemsPage') {
        genLibPage(dat.data);
    }
    if (dat.action == 'tradeMsgPage') {
        genTradePage(dat.data);
    }
    if (dat.action == 'equipSimulatorPage') {
        genEquipSimulator(dat.data);
    }
}

// Function to load a local JSON file into an object
function loadLocalJSON(callback) {
    const jsonFile = '/debug.json'; // Replace with the actual name of your JSON file
    const jsonUrl = chrome.runtime.getURL(jsonFile);

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            callback(data);
        })
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });
}
