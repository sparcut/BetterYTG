import 'src/sass/content.sass';
import ChatWatcher from './ChatWatcher';
import RouteWatcher from './RouteWatcher';

import PersistentSyncStorage from 'src/helpers/PersistentSyncStorage';

import Emotes from './Emotes';

let MAIN = null;

// ---

class Main {
  constructor() {
    this.routeWatcher = null;
    this.chatWatcher = null;

    this.onRouteChange = this.onRouteChange.bind(this);

    this.load();
  }

  load() {
    this.routeWatcher = new RouteWatcher;
    this.routeWatcher.on('change', this.onRouteChange);

    this.onRouteChange()
  }

  onRouteChange() {
    setTimeout(() => {
      if(this.isLivestream()) {
        this.init();
      }
    }, 2000); 
  }

  init() {
    this.chatWatcher = new ChatWatcher;
    this.chatWatcher.init();
  }

  unload() {
    if(this.chatWatcher !== null) {
      this.chatWatcher.unload();
      this.chatWatcher = null;
    }

  }

  isLivestream() {
    const timeDisplay = document.querySelector('.ytp-time-display');
    const chatApp = document.querySelector('yt-live-chat-app');
    const chatHeader = document.querySelector('.yt-live-chat-renderer-0');
  
    const timeDisplayCheck = timeDisplay && timeDisplay.classList.contains('ytp-live');
    const chatCheck = (document.body.contains(chatApp) || document.body.contains(chatHeader));
  
    return (timeDisplayCheck || chatCheck);
  }
}

// ---

if(document.getElementsByTagName('ytg-app').length > 0) { // Is YTG
  MAIN = new Main;
}

console.log('BYTG INIT');