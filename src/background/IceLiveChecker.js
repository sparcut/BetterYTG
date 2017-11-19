import axios from 'axios';
import dateFormat from  'date-fns/format';
import { Notifications } from '../utils/chrome';

import PersistentSyncStorage from '../helpers/PersistentSyncStorage';
import Icon from '../helpers/Icon';

import CONFIG from '../config';

class IceLiveChecker { // TODO: Make this disablable, so it can be enabled/disabled on option change
  constructor() {
    this._onClickNotification = this._onClickNotification.bind(this);

    this._liveRequest = null;
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
    const badgeBackgroundColor = '#ac19e8';
    let iconColor;
    let badgeText;

    if(liveStatus === true) {
      iconColor = 'purple';
      badgeText = 'LIVE';
    } else {
      iconColor = 'red';
      badgeText = '';
    } 
    
    Icon.set(iconColor);
    Icon.setBadgeBackgroundColor(badgeBackgroundColor);
    Icon.setBadgeText(badgeText);
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