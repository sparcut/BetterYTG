import dateFormat from 'date-fns/format';
import { debounce } from 'lodash';
import { Notifications } from './utils/chrome';

import PersistentSyncStorage from './helpers/PersistentSyncStorage';
import './sass/optionsPage.sass';

// Function Definitions

const hideDebounce = debounce((ele) => {
  ele.classList.remove('show');
}, 1000);

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

const inputListenerValues = (input) => {
  const isCheckbox = input.type === 'checkbox';
  const isTextbox = input.type === 'text';
  const inputValueKey = isCheckbox ? 'checked' : 'value';
  
  if(PersistentSyncStorage.data.options.hasOwnProperty(input.id)) {
    input[inputValueKey] = PersistentSyncStorage.data.options[input.id];
  }

  const eventType = isTextbox ? 'input' : 'change';

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

    /**
     * textboxes need to have `input` event listener so it triggers on each key input. 
     * `change` event only fires when the textbox blurs, so has potential for not saving 
     * if user closes options without clicking out of textbox.
     * 
     * Saving on each keystroke can cause chrome storage.set limit to prevent further setting.
     * Thus, we need to debounce the text input.
     */
    if(isTextbox) {
      return debounce(saveOption, 500);  
    } else {
      return saveOption;
    }
  })();
  
  return { eventType, onChange }
}

const initRangeWithDisplay = (rangeContainer) => {
  const input = rangeContainer.querySelector('.range-input');
  const output = rangeContainer.querySelector('.range-output');

  const inputMin = input.getAttribute('min');
  const inputMax = input.getAttribute('max');
  const inputRange = inputMax - inputMin;
  const outputMultiplier = output.dataset.multiplier || 1;

  input.addEventListener('input', () => {
    const inputVal = input.value;
    const position = ((inputVal - inputMin) / inputRange) * 100;
    
    output.setAttribute('style', `left: ${position}%`);
    output.innerHTML = Math.floor(inputVal * outputMultiplier); 
  });
}

// Executed code
const OptionInputs = document.querySelectorAll('.option-input');
const TestNotificationButton = document.getElementById('test-notification');
const RangeWrappers = document.querySelectorAll('.range-wrapper'); 

PersistentSyncStorage.on('ready', () => {
  OptionInputs.forEach((input) => {
    const inputListener = inputListenerValues(input);
    input.addEventListener(inputListener.eventType, inputListener.onChange);
    
    input.removeAttribute('disabled');
  });
});

TestNotificationButton.addEventListener('click', testNotification);

RangeWrappers.forEach(initRangeWithDisplay);