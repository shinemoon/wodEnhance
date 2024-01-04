// popup.js

document.addEventListener('DOMContentLoaded', function () {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const statusText = document.getElementById('status');

  // Ask the service worker for the initial switch state
  navigator.serviceWorker.controller.postMessage({ action: 'getSwitchState' });

  // Listen for messages from the service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    const { action, data } = event.data;

    if (action === 'switchState') {
      // Update the switch state in the popup UI
      toggleSwitch.checked = data;
      updateStatusText();
    } else if (action === 'switchStateUpdated') {
      // Handle state update if needed
    }
  });

  // Handle switch state changes
  toggleSwitch.addEventListener('change', function () {
    const newState = toggleSwitch.checked;

    // Notify the service worker to update the switch state
    navigator.serviceWorker.controller.postMessage({
      action: 'setSwitchState',
      data: newState,
    });

    updateStatusText();
  });

  // Update status text based on the switch state
  function updateStatusText() {
    const stateText = toggleSwitch.checked ? 'ON' : 'OFF';
    statusText.innerText = `Extension is ${stateText}`;
  }
});
