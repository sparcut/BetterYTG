import Emotes from './Emotes';
import Message from './Message';

class ChatWatcher {
  constructor() {
    this.watchChat = this.watchChat.bind(this);

    this._chatContainer = null;
    this._observer = null;

    this.messages = new Map();
  }

  init() {
    return new Promise((res, rej) => {
      this.getChatContainer()
        .then(Emotes.init)
        .then(this.watchChat);
    });
  }

  getChatContainer() {
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

  watchChat() {
    console.log('Chat observer started');
    this._observer = new MutationObserver(mutations => {

      mutations.forEach(mutation => {
        const { addedNodes, removedNodes } = mutation;
        
        // Added nodes
        if(typeof addedNodes !== 'undefined' && addedNodes.length > 0) {
          for(let i = 0, length = addedNodes.length-1; i <= length; i++) {
            const node = addedNodes[i];
            if(this.isMessageNode(node)) {
              this.onNewMessage(node);
            }
          }
        }

        // Removed nodes
        if(typeof removedNodes !== 'undefined' && removedNodes.length > 0) {
          for(let i = 0, length = removedNodes.length-1; i <= length; i++) {
            const node = removedNodes[i];
            if(this.isMessageNode(node) && this.isObservedMessage(node)) {
              this.onObservedMessageRemoved(node);
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
  
  onNewMessage(node) {
    const message = new Message(node);

    // Don't store message if has 0 emotes
    if(message.hasEmotes) {
      this.messages.set(message.id, message);
    }
  }

  onObservedMessageRemoved(node) {
    const BYTGid = node.getAttribute('bytg-id');
    const message = this.messages.get(BYTGid);
    message.destroy();

    this.messages.delete(BYTGid);
  }

  isMessageNode(node) {
    return node.tagName === 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER';
  }

  isObservedMessage(node) {
    return node.getAttribute('bytg-id') !== null;
  }
}

export default ChatWatcher;
