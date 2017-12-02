import 'src/stylus/setupPage.styl';

import PersistentSyncStorage from 'src/helpers/PersistentSyncStorage';


// --- Definitions ---
const completeButton = document.querySelector('.complete-setup-button');
const successOverlay = document.querySelector('.success-overlay')
const successIcon = successOverlay.querySelector('.material-icons');
const successCloseMessageCountdown = successOverlay.querySelector('.countdown');

const setupComplete = () => {
  successOverlay.classList.add('show');

  setTimeout(() => {
    successIcon.classList.add('show');
  }, 100);

  let closeCountdown = 5; // seconds
  const closeTimeout = () => {
    successCloseMessageCountdown.innerHTML = closeCountdown;
    setTimeout(() => {
      if(closeCountdown > 1) {
        closeCountdown -= 1;
        closeTimeout();
      } else {
        chrome.tabs.getCurrent((tab) => {
          chrome.tabs.remove(tab.id);
        });
      }
    }, 1000);
  }

  successCloseMessageCountdown.innerHTML = closeCountdown;
  closeTimeout();
}

// --- Main ---

const main = () => {

  // Shitty way of getting inputs and values, will be a pain to maintain...
  const inputs = {
    isPurpleArmy_true: document.getElementById('isPurpleArmy_true')
  }

  completeButton.addEventListener('click', () => {
    let setupOutput = {}

    setupOutput.isPurpleArmy = isPurpleArmy_true.checked;

    chrome.runtime.sendMessage({
      name: 'setupComplete',
      data: setupOutput
    }, setupComplete);
  });
}

// --- Executed ---

main();

PersistentSyncStorage.on('ready', () => {
  if(!!PersistentSyncStorage.data.setupComplete === true) {
    console.error('Setup is already complete');
  }
});
