import dateFormat from 'date-fns/format';
import { Notifications, SyncStorage } from './utils/chrome';

import './sass/options.sass'

let Options = {};
SyncStorage.listen((oldValue, newValue) => Options = newValue, 'options');

// Function Definitions
const saveOptions = (options) => {
  return new Promise((res, rej) => {
    chrome.storage.sync.get('options', (items = {}) => {
      const oldOptions = items.options || {};
      const newOptions = Object.assign(oldOptions, options);
      chrome.storage.sync.set({ options: newOptions }, () => {
        res();
      });
    });
  });
}

const setSavingStatus = (status) => {
  const SaveStatusEle = document.getElementById('save-status');

  switch(status) {
    case 'saving':
      SaveStatusEle.innerHTML = 'Saving ...';
    break;
    case 'saved':
      SaveStatusEle.innerHTML = 'Saved';
    break;
    default:
      SaveStatusEle.innerHTML = '&nbsp;';
  }
}

const testNotification = () => {
  Notifications.create('test', {
    type: 'basic',
    iconUrl: '../assets/icons/purple_128.png',
    title: `Test notification! (${dateFormat(Date.now(), 'h:mm a')})`,
    message: 'This notification was generated as a test.',
    contextMessage: 'BetterIPTV',
    priority: 2,
    eventTime: Date.now(),
    isClickable: true
  }).then(() => {
    const notificationSound = new Audio('../assets/old_online_sound.mp3');
    notificationSound.volume = (Options.notificationVolume || 0.5);
    notificationSound.play();
  });
}

// Executed code (starts here)
const OptionInputs = document.querySelectorAll('.option-input');
const TestNotificationButton = document.getElementById('test-notification'); 

chrome.storage.sync.get('options', (items = {}) => {
  const options = items.options || {};
  OptionInputs.forEach((input) => {
    const isCheckbox = input.type === 'checkbox' ? true : false;

    if(options.hasOwnProperty(input.id)) {
      if(isCheckbox) {
        input.checked = options[input.id];
      } else {
        input.value = options[input.id];
      }
    }

    input.removeAttribute('disabled');

    const onInputChange = () => {
      if(isCheckbox) {
        return () => {
          setSavingStatus('saving');
          saveOptions({ [input.id]: input.checked })
            .then(() => {
              setSavingStatus('saved');
            });
        }
      } else {
        return () => {
          setSavingStatus('saving');
          saveOptions({ [input.id]: input.value })
            .then(() => {
              setSavingStatus('saved');
            });
        }
      }
    }
    input.addEventListener('change', onInputChange());
  });
});

TestNotificationButton.addEventListener('click', testNotification);