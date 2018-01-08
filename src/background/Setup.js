import PersistentSyncStorage from '../helpers/PersistentSyncStorage';
import Icon from '../helpers/Icon';

import CONFIG from '../config';


const ensure = () => {
  return new Promise((res, rej) => {

    // Resolves if setup is complete
    if(PersistentSyncStorage.data.setupComplete) {
      // Ensure new options (on extension update) are added to options object
      PersistentSyncStorage.set({
        options: Object.assign({}, CONFIG.defaultOptions, PersistentSyncStorage.data.options)
      });
      return res();
    }

    // Otherwise inits setup
    const onSetupComplete = (message, sender) => {
      if(message.name === 'setupComplete') {
        chrome.runtime.onMessage.removeListener(onSetupComplete);
        
        if(message.data.isPurpleArmy) {
          const icedOptions = Object.assign({}, PersistentSyncStorage.data.options, CONFIG.iceOptions);
          PersistentSyncStorage.set({ options: icedOptions });
        }
        
        PersistentSyncStorage.set({
          setupComplete: true
        });

        Icon.set('red');
        res();
      }
    }

    Icon.set('grey');
    chrome.tabs.create({ url: './html/setup.html' });
    chrome.runtime.onMessage.addListener(onSetupComplete);
  });
}


export default {
  ensure
}