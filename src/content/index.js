import 'src/stylus/content.styl';
import ChatScroller from './ChatScroller';
import ChatWatcher from './ChatWatcher';
import RouteWatcher from './RouteWatcher';

import PersistentSyncStorage from 'src/helpers/PersistentSyncStorage';


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

    this.onRouteChange();
  }

  onRouteChange() {
    if(this.isLivestream()) {
      this.init();
    }
    // setTimeout(() => {
    // }, 500); 
  }

  init() {
    this.chatWatcher = new ChatWatcher;
    this.chatWatcher.init();
    
    this.chatScroller = new ChatScroller;
    this.chatScroller.init();
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

PersistentSyncStorage.on('ready', () => {
  MAIN = new Main;
});

console.log('BYTG INIT');