import dateFormat from 'date-fns/format';
import { debounce } from 'lodash';
import { Notifications } from './utils/chrome';

import Options from './helpers/Options';
import './sass/options.sass';

// Function Definitions

const hideDebounce = debounce((ele) => {
  ele.classList.remove('show');
}, 1000);

const setSavingStatus = (status) => {
  const SaveStatusEle = document.getElementById('save-status');
  SaveStatusEle.classList.add('show');

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
}

const testNotification = () => {
  if(Options.get('enableLiveNotification')) {
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
      if(Options.get('enableNotificationSound')) {
        const notificationSound = new Audio('../assets/old_online_sound.mp3');
        notificationSound.volume = (Options.get('notificationVolume') || 0.5);
        notificationSound.play();
      }
    });
  }
}

const inputListenerValues = (input) => {
  const isCheckbox = input.type === 'checkbox';
  const isTextbox = input.type === 'text';
  const inputValueKey = isCheckbox ? 'checked' : 'value';
  
  if(Options.has(input.id)) {
    input[inputValueKey] = Options.get(input.id);
  }
  
  const eventType = isTextbox ? 'input' : 'change';

  const onChange = (() => {
    const saveOption = () =>  {
      setSavingStatus('saving');
      Options.set({ [input.id]: input[inputValueKey] })
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

// Executed code
const OptionInputs = document.querySelectorAll('.option-input');
const TestNotificationButton = document.getElementById('test-notification');

Options.on('ready', () => {
  OptionInputs.forEach((input) => {
    const inputListener = inputListenerValues(input);
    input.addEventListener(inputListener.eventType, inputListener.onChange);
    
    input.removeAttribute('disabled');
  });
});

TestNotificationButton.addEventListener('click', testNotification);