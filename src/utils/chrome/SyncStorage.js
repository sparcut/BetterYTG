import Storage from './Storage';

class SyncStorage extends Storage {
  constructor() {
    super();
    this.store = 'sync';
  }
}

export default SyncStorage;
