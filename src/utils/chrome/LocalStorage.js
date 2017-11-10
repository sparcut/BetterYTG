class LocalStorage {
  constructor() {
    this.store = chrome.storage.local;
  }

  get(keys) {
    return new Promise((res, rej) => {
      this.store.get(keys, (items) => {
        res(items);
      });
    });
  }

  set(items) {
    this.store.set(items);
  }

  listen(onChange) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if(areaName === 'local') {
        onChange(changes);
      }
    });
  }
}

export default new LocalStorage;
