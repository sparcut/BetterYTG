import axios from 'axios';

import PersistentSyncStorage from 'src/helpers/PersistentSyncStorage';
import CustomEmotes from 'src/assets/emotes/dictionary.json';

import Emote from './Emote';


class Emotes {
  constructor() {
    this.dictionary = new Map();
    this.init = this.init.bind(this);
  }

  init() {
    return Promise.all([
      (PersistentSyncStorage.data.options['enableTwitchEmotes'] && this._loadTwitch()),
      (PersistentSyncStorage.data.options['enableTwitchSubEmotes'] && this._loadTwitchSub()),
      (PersistentSyncStorage.data.options['enableBetterYTGEmotes'] && this._loadBetterYTG())
    ]);
  }

  _loadTwitch() {
    axios
      .get('https://twitchemotes.com/api_cache/v3/global.json')
      .then(({ data }) => {
        const emoteKeys = Object.keys(data);

        for(let i = emoteKeys.length-1; i >= 0; i--) {
          const emote = data[emoteKeys[i]];
          const url = `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`;
          this.dictionary.set(emote.code, new Emote({ code: emote.code, url }));
        }
      });
  }

  _loadTwitchSub() {
    axios
      .get('https://twitchemotes.com/api_cache/v3/images.json') // Sub emotes mapped by emotes (not channel, 'subscriber.json')
      .then(({ data }) => {
        const emoteKeys = Object.keys(data);

        for(let i = emoteKeys.length-1; i >= 0; i--) {
          const emote = data[emoteKeys[i]];
          const url = `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`;
          this.dictionary.set(emote.code, new Emote({ code: emote.code, url }));
        }
      });
  }

  _loadBetterYTG() {
    for(let i = CustomEmotes.length-1; i >= 0; i--) {
      const [ code, filename ] = CustomEmotes[i]; 
      const url = chrome.runtime.getURL(`/assets/emotes/${filename}`);
      this.dictionary.set(code, new Emote({ code, url }));
    }
  }

  set(key, value) {
    return this.dictionary.set(key, new Emote(value));
  }

  has(key) {
    return this.dictionary.has(key);
  }

  parseString(message) {
    const words = message.split(' ');
    let htmlOutput = '';

    // Check for and convert emotes
    for(let i = 0, length = words.length-1; i <= length; i++) {
      // ﻿ === 'ZERO WIDTH NO-BREAK SPACE'
      const word = words[i].replace('﻿', '').trim();

      const emote = this.dictionary.get(word);

      if(typeof emote !== 'undefined') {
        htmlOutput += emote.html + ' ';
      } else {
        htmlOutput += word + ' ';
      }
    }

    return htmlOutput;
  }
}

export default Emotes;