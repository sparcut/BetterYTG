import 'src/stylus/content.styl';
import ChatScroller from './ChatScroller';
import ChatWatcher from './ChatWatcher';
import RouteWatcher from './RouteWatcher';

import {
  isLivestream, isYoutubeGaming,
  isYoutubeEmbed, isYoutubeVanilla
} from 'src/helpers/Identification';
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
    const {
      enableYoutubeGaming,
      enableYoutubeVanilla,
      enableYoutubeEmbed
    } = PersistentSyncStorage.data.options;

    if(
      isLivestream() &&
      (
        (isYoutubeGaming() && enableYoutubeGaming) ||
        (isYoutubeVanilla() && enableYoutubeVanilla) ||
        (isYoutubeEmbed() && enableYoutubeEmbed)
      )
    ) {
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
}

// ---

PersistentSyncStorage.on('ready', () => {
  MAIN = new Main;
});

console.log('BYTG INIT');