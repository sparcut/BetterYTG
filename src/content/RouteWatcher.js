import EventEmitter from 'events';

class RouteWatcher extends EventEmitter {
    constructor() {
        super();

        this.docTitle = document.querySelector('head > title');
        this.observer = null;

        // load is deffered to allow for all modules to initialize first
        setTimeout(() => this.init());
    }

    init() {
        this.observer = new MutationObserver(mutations => {
            mutations.forEach((m) => {
                /**
                 * Title is set to 'YouTube Gaming' on main routes
                 * and between routes.
                 */
                if(m.target.innerText === 'YouTube Gaming') {
                    this.emit('default-title');
                } else {
                    this.emit('change');
                }
            });
        });

        this.observer.observe(this.docTitle, {
            childList: true,
            attributes: false,
            characterData: true,
            subtree: true
        })
    }
}

export default RouteWatcher;
