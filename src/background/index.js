import PersistentSyncStorage from '../helpers/PersistentSyncStorage';

import Setup from './Setup';
import IceLiveChecker from './IceLiveChecker';

import CONFIG from '../config.js';

// TODO: Make this a class, much easier to maintain.

// --- Global Variables ---



// --- Functions ---



// --- Main ---

const main = () => {
  let iceLiveChecker = null;
  
  if(PersistentSyncStorage.data.options['iceEnableLiveIcon'] || PersistentSyncStorage.data.options['iceEnableLiveNotification']) {
    iceLiveChecker = new IceLiveChecker;
    iceLiveChecker.init();
  }
}

// --- Executed ---

PersistentSyncStorage.on('ready', () => {
  // Ensure options store is setup
  if(!PersistentSyncStorage.has('options')) {
    PersistentSyncStorage.set({ options: CONFIG.defaultOptions });
  }

  Setup.ensure().then(main);
});
