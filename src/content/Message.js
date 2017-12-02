import Emotes from './Emotes';

class Message {
  constructor(messageNode) {
    this.node = messageNode;
    this.id = this.node.id; // this.id should not be used to reference the node, dom id changes due to optimisitc updates
    this.hasEmotes = null;
    this.observer = null;
    this.parsedText = ''; // This should be fine since you can't edit/change messages

    this.parseText();

    if(this.hasEmotes) {
      this.node.setAttribute('bytg-id', this.id);
      this.setHtml();
      this.watch();
    }
  }

  get textNode() {
    const node = this.node.querySelector('#message');
    return {
      node,
      text: node.innerText
    }
  }

  parseText() {
    const rawWords = this.textNode.text.split(' ');

    for(let i = 0, length = rawWords.length; i < length; i++) {
      const word = this.parseIllegalCharcters(rawWords[i]);
      const emote = Emotes.get(word);
      
      if(typeof emote === 'undefined') {
        this.parsedText += word + ' ';
      } else {
        this.hasEmotes = true;
        this.parsedText += emote.html + ' ';
      }
    }
  }

  watch() {
    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {

        if(typeof mutation.removedNodes === 'undefined') return;
        if(mutation.removedNodes.length <= 0) return; // This must be after undefined check
        
        let mutationIsEmote = false;

        for(let i = 0, length = mutation.removedNodes.length; i < length; i++) {
          const removedNode = mutation.removedNodes[i];

          if(typeof removedNode.className === 'string' && // check if className exists, is 'SVGAnimatedString' when window resized and removed 
              ~removedNode.className.indexOf('BYTG-Emote') !== 0) {
            mutationIsEmote = true;
          }
        }

        if(mutationIsEmote && document.body.contains(this.node)) {
          this.setHtml();
        }
      });
    });

    this.observer.observe(this.node, {
      childList: true,
      attributes: false,
      characterData: false,
      subtree: true
    });
  }

  setHtml() {
    this.textNode.node.innerHTML = this.parsedText;
  }

  parseIllegalCharcters(word) {
    // ﻿ === 'ZERO WIDTH NO-BREAK SPACE'
    return word.replace('﻿', '').trim();
  }
  
  destroy() {
    if(this.observer !== null) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

export default Message;