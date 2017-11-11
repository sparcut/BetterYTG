import Storage from './Storage';

class LocalStorage extends Storage {
  constructor() {
    super();
    this.store = 'local';
  }
}

export default LocalStorage;
