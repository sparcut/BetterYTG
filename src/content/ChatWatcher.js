import EventEmitter from 'events';

import Emotes from './Emotes';

class ChatWatcher extends EventEmitter {
  constructor() {
    super();

    this._watchChat = this._watchChat.bind(this);
    this.emit = this.emit.bind(this);

    this._chatContainer = null;
    this._observer = null;

    this.messages = new Set();
  }

  init() {
    this.emotes = new Emotes;
    return new Promise((res, rej) => {
      this._getChatContainer()
        .then(this.emotes.init)
        .then(this._watchChat);
    });
  }

  unload() {
    if(this._observer !== null) {
      this._observer.disconnect();
    }
  }

  _getChatContainer() {
    // Parent of actual chat (children are messages)
    const checkForContainer = (res, rej) => {
      this._chatContainer = document.querySelector('#items.style-scope.yt-live-chat-item-list-renderer');
      if(this._chatContainer !== null) {
        res();
      } else {
        setTimeout(checkForContainer.bind(this, res, rej), 250);
      }
    }

    return new Promise(checkForContainer);
  }

  _watchChat() {
    console.log('Chat observer started');
    this._observer = new MutationObserver(mutations => {
      
      mutations.forEach(mutation => {
        // console.log(mutation);
        // Added nodes
        if(typeof mutation.addedNodes !== 'undefined' && mutation.addedNodes.length > 0) {
          const Nodes = mutation.addedNodes;
          for(let i = 0, length = Nodes.length-1; i <= length; i++) {
            const node = Nodes[i];
            if(this._isMessageNode(node)) {
              this._onNewMessage(node);
            }
          }
        }
      });
    });

    this._observer.observe(this._chatContainer, {
      childList: true,
      attributes: false,
      characterData: false,
      subtree: false
    });
  }

  _isMessageNode(node) {
    return node.tagName === 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER';
  }

  _onNewMessage(node) {
    this.parseNode(node);
    this.watchSingleMessage(node);
    // this.emit('message', messageNode, message);
  }

  watchSingleMessage(node) {
    const singleObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if(typeof mutation.removedNodes !== 'undefined' && mutation.removedNodes.length > 0) {
          let isBYTGEmote = false;

          for(let i = 0, length = mutation.removedNodes.length-1; i <= length; i++) {
            const removedNode = mutation.removedNodes[i];
            if(removedNode.className && 
               ~removedNode.className.indexOf('BYTG-Emote') !== 0) {
              isBYTGEmote = true;
            }
          }

          if(isBYTGEmote) {
            this.parseNode(node);
          }
        }
      });
    });

    // this.messages.add(singleObserver);

    singleObserver.observe(node, {
      childList: true,
      attributes: false,
      characterData: false,
      subtree: true
    });
  }

  parseNode(node) {
    const textNode = node.querySelector('#message');
    const message = textNode.innerText;
    const parsed = this.emotes.parseString(message);
    console.log(parsed);
    textNode.innerHTML = parsed;
  }

}

export default ChatWatcher;
