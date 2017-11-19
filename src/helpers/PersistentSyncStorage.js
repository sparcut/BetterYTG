import { SyncStorage } from '../utils/chrome';
import { EventEmitter } from 'events';

class PersistentSyncStorage extends EventEmitter {
  constructor() {
    super();

    this._data = null;
    this.state = 'initiating';

    this._init();
  }

  async _init() {
    const fetchedData = await SyncStorage.get();
    this._initListener();

    this._data = fetchedData;
    this.state = 'ready';
    this.emit(this.state);
  }

  _initListener() {
    SyncStorage.listen((changes) => {

      Object.keys(changes).forEach((changeKey) => {
        if(changes[changeKey].hasOwnProperty('newValue')) {
          this._data[changeKey] = changes[changeKey].newValue;
        } else {
          console.error('No newValue in sync storge change');
        }
      });
      
      this.emit('change', this.data, changes);
    });
  }

  get data() {
    return this._data;
  }

  set(items) {
    return SyncStorage.set(items);
  }

  has(item) {
    return this.data.hasOwnProperty(item);
  }
}

export default new PersistentSyncStorage;