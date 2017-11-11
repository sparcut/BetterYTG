import axios from 'axios';

import LocalStorage from './utils/chrome/LocalStorage';

const CONFIG = {
  liveCheck: {
    url: 'http://107.170.95.160/live',
    interval: 30000
  }
}

const triggerLiveNotification = (liveRequest) => {
  chrome.notifications.create('liveNotification', {
    type: 'basic',
    iconUrl: liveRequest.thumbnail_url,
    title: 'Ice is live!',
    message: liveRequest.title,
    contextMessage: 'BetterIPTV',
    priority: 2,
    eventTime: Date.now(),
    isClickable: true
  });
}

const toggleLiveIcon = (liveStatus) => {
  const IconPath = liveStatus === true ?
    './assets/icons/green_128.png' : './assets/icons/purple_128.png';

  chrome.browserAction.setIcon({ path: IconPath });
}

const removeLiveNotification = () => {
  chrome.notifications.clear('liveNotification');
}

chrome.notifications.onClicked.addListener((notificationId) => {
  if(notificationId === 'liveNotification') {
    chrome.tabs.create({ url: 'https://gaming.youtube.com/ice_poseidon/live' });
    removeLiveNotification();
  }
});

const syncStorageChanged = (changes) => {}

const liveStatusChanged = (oldValue, newValue) => {
  const hasOldStatus = oldValue && oldValue.hasOwnProperty('status');
  const hasChanged = () => {
    if(newValue.status) {
      triggerLiveNotification(newValue);
    } else {
      // To remove if notification is present and stream status is false
      removeLiveNotification();
    }

    toggleLiveIcon(newValue.status);
  }
  
  if(hasOldStatus) {
    if(oldValue.status !== newValue.status) {
      hasChanged(newValue.status);
    }
  } else {
    hasChanged(newValue.status);
  }
}

const localStorageChanged = (changes) => {
  const changeResolver = {
    'liveRequest': liveStatusChanged
  }
  for(const changeKey in changes) {
    const oldValue = changes[changeKey].oldValue || null;
    const newValue = changes[changeKey].newValue;

    changeResolver[changeKey](oldValue, newValue);
  }
}

const liveCheck = () => {
  const request = axios.get(CONFIG.liveCheck.url);

  request.then(async (res) => {
    const data = res.data;
    const lastRequest = await LocalStorage.get('liveRequest');
    if(data !== lastRequest) {
      LocalStorage.set({ liveRequest: data }); // TODO: Need to ensure liveRequest is defined as error will be thrown if .status is called and not defined
    }
  });
}

const startLiveCheck = () => {
  liveCheck();
  return setInterval(() => {
    liveCheck();
  }, CONFIG.liveCheck.interval);
}

const startup = () => {
  // When adding another promise, return Promise.all(iterable). atm only 1 startup promise
  return LocalStorage.remove('liveRequest');
}

const main = async () => {
  await startup();

  // Init stuff under here
  LocalStorage.listen(localStorageChanged);
  startLiveCheck();
}
