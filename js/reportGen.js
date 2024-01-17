//document.addEventListener('DOMContentLoaded', function () {
$(document).ready(function () {
    console.log('Load ReportGen');
    if (typeof port === 'undefined') {
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
}

