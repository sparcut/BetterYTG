import axios from 'axios';
import dateFormat from  'date-fns/format';
import { LocalStorage, Notifications } from '../utils/chrome';

import CONFIG from '../config.js';

class LiveChecker {
  constructor() {
    this._liveRequestDidChange = this._liveRequestDidChange.bind(this);
    this._liveStatusDidChange = this._liveStatusDidChange.bind(this);
    this._onClickNotification = this._onClickNotification.bind(this);
  }
  
  async init() {
    await LocalStorage.remove('liveRequest');
    
    Notifications.listen('onClicked', 'live', this._onClickNotification);

    LocalStorage.listen('liveRequest', this._liveRequestDidChange);
    this.liveCheck();
    return setInterval(() => this.liveCheck(), CONFIG.liveCheck.interval);
  }

  liveCheck() {
    const request = axios.get(CONFIG.liveCheck.url);

    request.then(async (res) => {
      const data = res.data;
      const lastRequest = await LocalStorage.get('liveRequest');
      if(data !== lastRequest) {
        LocalStorage.set({ liveRequest: data }); // TODO: Need to ensure liveRequest is defined as error will be thrown if .status is called and not defined
      }
    });

    request.catch((rejectReason) => {
      // logger.error(rejectReason)?
    })
  }

  _liveRequestDidChange(oldValue, newValue) {
    const hasOldStatus = oldValue && oldValue.hasOwnProperty('status');
    
    if(hasOldStatus) {
      if(oldValue.status !== newValue.status) {
        this._liveStatusDidChange(newValue);
      }
    } else {
      this._liveStatusDidChange(newValue);
    }
  }

  _liveStatusDidChange(liveRequest) {
    if(liveRequest.status === true) {
      this._emitNotification(liveRequest);
    } else {
      // Remove if notification is present and stream status is false
      this._retractNotification();
    }

    this._toggleLiveIcon(liveRequest.status);
  }

  _emitNotification(liveRequest) {
    Notifications.create('live', {
      type: 'basic',
      iconUrl: liveRequest.thumbnail_url,
      title: `Ice Poseidon is live! (${dateFormat(Date.now(), 'h:mm a')})`,
      message: liveRequest.title,
      contextMessage: 'BetterIPTV',
      priority: 2,
      eventTime: Date.now(),
      isClickable: true,
      requireInteraction: true
    }).then(this._playLiveSound);
  }

  _onClickNotification() {
    chrome.tabs.create({ url: 'https://gaming.youtube.com/ice_poseidon/live' });
    this._retractNotification();
  }

  _retractNotification() {
    Notifications.clear('live');
  }

  _toggleLiveIcon(liveStatus) {
    const IconPath = liveStatus === true ?
      './assets/icons/green_128.png' : './assets/icons/purple_128.png'; // TODO: Fix icons here and in manifest https://developer.chrome.com/extensions/manifest/icons
    chrome.browserAction.setIcon({ path: IconPath });
  }

  _playLiveSound() {
    const notificationSound = new Audio('./assets/old_online_sound.mp3');
    notificationSound.volume = 0.5;
    notificationSound.play();
  }
}

export default new LiveChecker;