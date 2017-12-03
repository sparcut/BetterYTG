
class ChatScroller {
  constructor() {
    this.scroll = this.scroll.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this); 
    
    this.scroller = null;
    this.interval = null;
  }

  init() {
    this.getScroller()
      .then(() => {
        this.scroller.addEventListener('mouseleave', this.start);
        this.scroller.addEventListener('mouseenter', this.stop);
        this.start();
      });
  }

  start() {
    this.interval = setInterval(
      this.scroll,
      250
    );
  }

  stop() {
    clearInterval(this.interval);
  }
  
  scroll() {
    this.scroller.scrollTop = 9999;
  }

  getScroller() {
    const checkForScroller = (res, rej) => {
      this.scroller = document.getElementById('item-scroller');
      if(this.scroller !== null) {
        res();
      } else {
        setTimeout(checkForScroller.bind(this, res, rej), 250);
      }
    }

    return new Promise(checkForScroller);
  }
}

export default ChatScroller;