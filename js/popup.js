// popup.js
// Fetch manifest.json
let extVer = null;

fetch('manifest.json')
  .then(response => response.json())
  .then(data => {
    // Access the properties in the manifest.json file
    console.log('Version:', data.version);
    extVer = data.version;
    // You can do more with other properties as needed
    $('#metainfo').text("WoDEnhancement "+extVer);
  })
  .catch(error => console.error('Error fetching manifest.json:', error));

document.addEventListener('DOMContentLoaded', function () {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const statusText = document.getElementById('status');

  const toggleNight = document.getElementById('toggleNight');
  const nightText = document.getElementById('night');



  // Ask the service worker for the initial switch state
  navigator.serviceWorker.controller.postMessage({ action: 'getSwitchState' });

  // Listen for messages from the service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log(event);
    const { action, data } = event.data;

    if (action === 'extensionState') {
      // Update the switch state in the popup UI
      toggleSwitch.checked = data['onoff'];
      toggleNight.checked = data['night'];
      //updateStatusText();
    } else if (action === 'extensionStateUpdated') {
      // Handle state update if needed
    }

  });


  // popup.js
  const port = chrome.runtime.connect({ name: "popup" });

  // port.postMessage({ action: "executeCode", data: 0 });

  // Listen for responses from the service worker
  port.onMessage.addListener((response) => {
    console.log("Response from service worker:", response);
  });

  // Handle switch state changes
  toggleSwitch.addEventListener('change', function () {
    updateSwitch();
  });

  toggleNight.addEventListener('change', function () {
    updateSwitch();
    updateNight();
  });

  function updateNight() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          type: "set_isDark",
          value: toggleNight.checked,
        },
      );
    });
  }

  function updateSwitch() {
    const newState = toggleSwitch.checked;
    const nightState = toggleNight.checked;
    // Notify the service worker to update the switch state
    navigator.serviceWorker.controller.postMessage({
      action: 'setSwitchState',
      data: { onoff: newState, night: nightState }
    });
    //updateStatusText();
  };


  // Update status text based on the switch state
  function updateStatusText() {
    const stateText = toggleSwitch.checked ? 'ON' : 'OFF';
    const nightStatus = toggleNight.checked ? 'ON ' : 'OFF';
    statusText.innerText = `扩展 ${stateText}`;
    nightText.innerText = `黑暗模式 ${nightStatus}`;
  }
});
