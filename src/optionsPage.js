import 'src/stylus/optionsPage.styl';

import dateFormat from 'date-fns/format';
import { debounce } from 'lodash';
import { Notifications } from 'src/utils/chrome';

import PersistentSyncStorage from 'src/helpers/PersistentSyncStorage';

// Function Definitions

const setSavingStatus = (status) => {
  const SaveStatusEle = document.getElementById('save-status');

  switch(status) {
    case 'saving':
      SaveStatusEle.innerHTML = 'Saving ...';
    break;
    case 'saved':
      SaveStatusEle.innerHTML = 'Saved';
      hideDebounce(SaveStatusEle);
    break;
    default:
      SaveStatusEle.innerHTML = '&nbsp;';
  }

  SaveStatusEle.classList.add('show');
}

const testNotification = () => {
  if(PersistentSyncStorage.data.options['iceEnableLiveNotification']) {
    Notifications.create('test', {
      type: 'basic',
      iconUrl: '../assets/icons/BetterYTG_purple_128.png',
      title: `Test notification! (${dateFormat(Date.now(), 'h:mm a')})`,
      message: 'This notification was generated as a test.',
      contextMessage: 'BetterYTG',
      priority: 2,
      eventTime: Date.now(),
      isClickable: true
    }).then(() => {
      if(PersistentSyncStorage.data.options['iceEnableNotificationSound']) {
        const notificationSound = new Audio('../assets/old_online_sound.mp3');
        notificationSound.volume = (PersistentSyncStorage.data.options['iceNotificationVolume'] || 0.5);
        notificationSound.play();
      }
    });
  }
}

const optionOnChange = (input) => {
  const isCheckbox = input.type === 'checkbox';
  const inputValueKey = isCheckbox ? 'checked' : 'value';
  
  if(PersistentSyncStorage.data.options.hasOwnProperty(input.id)) {
    input[inputValueKey] = PersistentSyncStorage.data.options[input.id];
  }

  const eventType = 'change';

  const onChange = (() => {
    const saveOption = () =>  {
      setSavingStatus('saving');
      const updatedOptions = Object.assign({}, PersistentSyncStorage.data.options, {
        [input.id]: input[inputValueKey]
      });
      PersistentSyncStorage.set({ options: updatedOptions })
        .then(() => {
          setSavingStatus('saved');
        });
    }

    return saveOption;
  })();
  
  return onChange
}


// Executed code
const OptionInputs = document.querySelectorAll('.option-input');
const TestNotificationButton = document.getElementById('test-notification');

PersistentSyncStorage.on('ready', () => {
  OptionInputs.forEach((input) => {
    const inputOnChange = optionOnChange(input);
    input.addEventListener('change', inputOnChange);
    
    input.removeAttribute('disabled');
  });
});

TestNotificationButton.addEventListener('click', testNotification);
