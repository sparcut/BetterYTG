import EventEmitter from 'events';

class RouteWatcher extends EventEmitter {
  constructor() {
    super();

    this.target = document.querySelector('head > title');
    this.observer = null;

    this.init();
  }

  init() {
    this.observer = new MutationObserver(mutations => {
      mutations.forEach((m) => {
        /**
         * Title is set to 'YouTube Gaming' on main routes
         * and between routes.
         */
        if(m.target.innerText === 'YouTube Gaming') {
          this.emit('main');
        } else {
          this.emit('change');
        }
      });
    });

    if(this.target !== null) { // Popout chat does not have title tag
      this.observer.observe(this.target, {
        childList: true,
        attributes: false,
        characterData: true,
        subtree: true
      });
    }
  }
}

export default RouteWatcher;
