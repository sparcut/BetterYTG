class LocalStorage {
  constructor() {
    this.store = chrome.storage.local;
  }

  get(keys = null) {
    return new Promise((res, rej) => {
      // resolve args = items:object
      this.store.get(keys, res);
    });
  }

  getBytesInUse(keys = null) {
    return new Promise((res, rej) => {
      // resolve args = bytesInUse:integer
      this.store.getBytesInUse(keys, res);
    });
  }

  set(items) {
    return new Promise((res, rej) => {
      // resolve args = (none)
      this.store.set(items, res);
    });
  }

  remove(keys) {
    // resolve args = (none)
    return new Promise((res, rej) => {
      this.store.remove(keys, res);
    });
  }

  clear() {
    // resolve args = (none)
    return new Promise((res, rej) => {
      this.store.clear(res);
    });
  }

  listen(onChange, item = null) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if(areaName === 'local') {
        if(item !== null) {
          if(changes.hasOwnProperty(item)) {
            onChange(changes);
          }
        } else {
          onChange(changes);
        }
      }
    });
  }
}

export default new LocalStorage;
