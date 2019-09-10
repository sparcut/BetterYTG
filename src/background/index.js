import PersistentSyncStorage from 'src/helpers/PersistentSyncStorage';

import Setup from './Setup';

import CONFIG from 'src/config';

class Main {
  constructor() {
    this.init = this.init.bind(this);

    PersistentSyncStorage.on('ready', () => {
      this.setupOptions();  
      Setup.ensure().then(this.init);
    });
  }
  
  init() {}

  setupOptions() {
    // Ensure options store is setup
    if(!PersistentSyncStorage.has('options')) {
      PersistentSyncStorage.set({ options: CONFIG.defaultOptions });
    }
  }
}

const main = new Main;