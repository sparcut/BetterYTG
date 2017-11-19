import axios from 'axios';
import dateFormat from  'date-fns/format';
import { Notifications } from '../utils/chrome';

import PersistentSyncStorage from '../helpers/PersistentSyncStorage';

import CONFIG from '../config';

class IceLiveChecker { // TODO: Make this disablable, so it can be enabled/disabled on option change
  constructor() {
    this._liveRequestDidChange = this._liveRequestDidChange.bind(this);
    this._liveStatusDidChange = this._liveStatusDidChange.bind(this);
    this._onClickNotification = this._onClickNotification.bind(this);

    this._liveRequest = null;

    // TODO: icons need to be normalized into module to control what currrent icons etc. (current icon grey or red)
    // TODO: Icon paths can be made easy since has naming convetion
    this._liveIcons = {
      '16': './assets/images/BetterYTG_purple_16.png',
      '48': './assets/images/BetterYTG_purple_48.png',
      '128': './assets/images/BetterYTG_purple_128.png'
    }
    this._normalIcons = {
      '16': './assets/images/BetterYTG_red_16.png',
      '48': './assets/images/BetterYTG_red_48.png',
      '128': './assets/images/BetterYTG_red_128.png'
    }
  }
  
  async init() {
    
    Notifications.listen('onClicked', 'live', this._onClickNotification);
    
    this.liveCheck();
    return setInterval(() => this.liveCheck(), CONFIG.iceLiveCheck.interval);
  }

  liveCheck() {
    const request = axios.get(CONFIG.iceLiveCheck.url);

    request.then((res) => {
      const data = res.data;
      if(data !== this.liveRequest) {
        this._liveRequest = data; // TODO: Need to ensure liveRequest is defined as error will be thrown if .status is called and not defined
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

  _liveStatusDidChange() {
    if(this.liveRequest.status === true) {
      this._emitNotification();
    } else {
      // Remove if notification is present and stream status is false
      this._retractNotification();
    }

    this._toggleLiveIcon();
  }

  _emitNotification() {
    if(PersistentSyncStorage.data.options['iceEnableLiveNotification']) {
      Notifications.create('live', {
        type: 'basic',
        iconUrl: this.liveRequest.thumbnail_url,
        title: `Ice Poseidon is live! (${dateFormat(Date.now(), 'h:mm a')})`,
        message: this.liveRequest.title,
        contextMessage: 'BetterYTG',
        priority: 2,
        eventTime: Date.now(),
        isClickable: true,
        requireInteraction: true
      }).then(this._playLiveSound);
    }
  }

  _onClickNotification() {
    chrome.tabs.create({ url: 'https://gaming.youtube.com/ice_poseidon/live' });
    this._retractNotification();
  }

  _retractNotification() {
    Notifications.clear('live');
  }

  _toggleLiveIcon(liveStatus) {
    const badgeBackgroundColor = '#AC19E8';
    let iconPath;
    let badgeText;

    if(liveStatus === true) {
      iconPath = this._liveIcons;
      badgeText = 'LIVE';
    } else {
      iconPath = this._normalIcons;
      badgeText = '';
    } 
    
    chrome.browserAction.setIcon({ path: iconPath });
    chrome.browserAction.setBadgeBackgroundColor({ color: badgeBackgroundColor });
    chrome.browserAction.setBadgeText({ text: badgeText });
  }

  _playLiveSound() {
    if(PersistentSyncStorage.data.options['iceEnableNotificationSound']) {
      const notificationSound = new Audio('./assets/old_online_sound.mp3');
      notificationSound.volume = PersistentSyncStorage.data.options['notificationVolume'];
      notificationSound.play();
    }
  }

  // ---

  get liveRequest() {
    return this._liveRequest
  }
}

export default IceLiveChecker;