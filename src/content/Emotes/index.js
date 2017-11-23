import axios from 'axios';

import PersistentSyncStorage from 'src/helpers/PersistentSyncStorage';
import CustomEmotes from 'src/assets/emotes/dictionary.json';

class Emotes {
  constructor() {
    this.dictionary = [];

    if(PersistentSyncStorage.data.options['enableTwitchEmotes']) this.loadTwitch();
    if(PersistentSyncStorage.data.options['enableTwitchSubEmotes']) this.loadTwitchSub();
    if(PersistentSyncStorage.data.options['enableBetterTTVEmotes']) this.loadBTTV(); 
  }

  loadTwitch() {
    axios
      .get('https://twitchemotes.com/api_cache/v3/global.json')
      .then(({ data }) => {
        const emoteKeys = Object.keys(data);

        for(let length = emoteKeys.length-1; length >= 0; length--) {
          const emote = data[emoteKeys[length]];
          this.dictionary[emote.code] = `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`;
        }
      });
  }

  loadTwitchSub() {
    axios
      .get('https://twitchemotes.com/api_cache/v3/images.json') // Sub emotes mapped by emotes (not channel, 'subscriber.json')
      .then(({ data }) => {
        const emoteKeys = Object.keys(data);

        for(let length = emoteKeys.length-1; length >= 0; length--) {
          const emote = data[emoteKeys[length]];
          this.dictionary[emote.code] = `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`;
        }
      });
  }

  loadCustom() {
    const emoteKeys = Object.keys(CustomEmotes);

    for(let length = emoteKeys.length-1; length >= 0; length--) {
      const key = emoteKeys[length];
      this.dictionary[key] = chrome.runtime.getURL(`./assets/emotes/${CustomEmotes[key]}`);
    }
  }

}