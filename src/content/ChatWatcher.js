class ChatWatcher {
    constructor() {
        this.watchChat = this.watchChat.bind(this);

        this.chatContainer = null;
        this.observer = null;

        // load is deffered to allow for all modules to initialize first
        setTimeout(() => this.init());
    }

    init() {
        this.getChatContainer()
            .then(this.watchChat);
    }

    getChatContainer() {
        // Parent of actual chat (children are messages)
        const checkForContainer = (res, rej) => {
            this.chatContainer = document.querySelector('#items.style-scope.yt-live-chat-item-list-renderer');
            if (this.chatContainer === null) {
                setTimeout(checkForContainer.bind(this, res), 250);
            } else {
                // console.log('Container found');
                // console.log(this.chatContainer);
                res();
            }
        }

        return new Promise(checkForContainer);
    }

    watchChat() {
        console.log('Chat observer started');
        this.observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // console.log(mutation);
                // for(const ele of mutation.addedNodes) {}
            });
        });

        this.observer.observe(this.chatContainer, {
            childList: true,
            attributes: false,
            characterData: false,
            subtree: false
        });
    }
}

export default ChatWatcher;
