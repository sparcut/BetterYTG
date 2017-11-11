class Storage {

  get(keys = null) {
    return new Promise((res, rej) => {
      const returnSingle = typeof keys === 'string';
      // resolve args = items:object
      chrome.storage[this.store].get(keys, (items) => {
        if(returnSingle) {
          res(items[keys]);
        } else {
          res(items);
        }
      });
    });
  }

  getBytesInUse(keys = null) {
    return new Promise((res, rej) => {
      // resolve args = bytesInUse:integer
      chrome.storage[this.store].getBytesInUse(keys, res);
    });
  }

  set(items) {
    return new Promise((res, rej) => {
      // resolve args = (none)
      chrome.storage[this.store].set(items, res);
    });
  }

  remove(keys) {
    // resolve args = (none)
    return new Promise((res, rej) => {
      chrome.storage[this.store].remove(keys, res);
    });
  }

  clear() {
    // resolve args = (none)
    return new Promise((res, rej) => {
      chrome.storage[this.store].clear(res);
    });
  }

  listen(onChange, item = null) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if(areaName === this.store) {
        if(item !== null) {
          if(changes.hasOwnProperty(item)) {
            const oldValue = changes[item].oldValue || null;
            const newValue = changes[item].newValue || null;
            onChange(oldValue, newValue);
          }
        } else {
          onChange(changes);
        }
      }
    });
  }
}

export default Storage;
