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

chrome.notifications.onClicked.addListener((notificationId) => {
  if(notificationId === 'liveNotification') {
    chrome.tabs.create({ url: 'https://gaming.youtube.com/ice_poseidon/live' });
    chrome.notifications.clear(notificationId);
  }
});

const syncStorageChanged = (changes) => {}

const localStorageChanged = (changes) => {
  for(const changeKey in changes) {
    const change = changes[changeKey];
    switch(changeKey) {
      case 'liveRequest':
        if(change.newValue.status !== change.oldValue.status) {
          if(change.newValue === true) {
            triggerLiveNotification(change.newValue);
            toggleLiveIcon(change.newValue.status);
          } else {
            toggleLiveIcon(change.newValue.status);
          }
        }
      break;
    }
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

LocalStorage.listen(localStorageChanged);
startLiveCheck();
