import PersistentSyncStorage from '../helpers/PersistentSyncStorage';
import CONFIG from '../config';

const inactiveIcons = {
  '16': './assets/images/BetterYTG_grey_16.png',
  '48': './assets/images/BetterYTG_grey_48.png',
  '128': './assets/images/BetterYTG_grey_128.png'
}

const ensure = () => {
  return new Promise((res, rej) => {

    // Resolves if setup is complete
    if(PersistentSyncStorage.data.setupComplete) {
      return res();
    }

    // Otherwise inits setup
    const onSetupComplete = (message, sender) => {
      if(message.name === 'setupComplete') {
        
        if(message.data.isPurpleArmy) {
          const icedOptions = Object.assign({}, PersistentSyncStorage.data.options, CONFIG.iceOptions);
          PersistentSyncStorage.set({ options: icedOptions });
        }
        
        PersistentSyncStorage.set({
          setupComplete: true
        });

        chrome.runtime.onMessage.removeListener(onSetupComplete);
        res();
      }
    }

    chrome.browserAction.setIcon({ path: inactiveIcons });
    chrome.tabs.create({ url: './html/setup.html' });
    chrome.runtime.onMessage.addListener(onSetupComplete);
  });
}


export default {
  ensure
}