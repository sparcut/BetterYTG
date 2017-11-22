import PersistentSyncStorage from 'src/helpers/PersistentSyncStorage';

import Setup from './Setup';
import IceLiveChecker from './IceLiveChecker';

import CONFIG from 'src/config';

class Main {
  constructor() {
    this.init = this.init.bind(this);
    this.iceLiveChecker = null;

    PersistentSyncStorage.on('ready', () => {
      this.setupOptions();  
      Setup.ensure().then(this.init);
    });
  }
  
  init() {
    this.iceLiveChecker = new IceLiveChecker;

    if(PersistentSyncStorage.data.options['iceEnableLiveIcon'] || PersistentSyncStorage.data.options['iceEnableLiveNotification']) {
      this.iceLiveChecker.enable();
    }
  }
  
  setupOptions() {
    // Ensure options store is setup
    if(!PersistentSyncStorage.has('options')) {
      PersistentSyncStorage.set({ options: CONFIG.defaultOptions });
    }
  }
}

const main = new Main;