import '../sass/content.sass';
import ChatWatcher from './ChatWatcher';
import RouteWatcher from './RouteWatcher';

const isLivestreamPage = () => {
    const timeDisplay = document.querySelector('.ytp-time-display');
    const chatApp = document.querySelector('yt-live-chat-app');
    const chatHeader = document.querySelector('.yt-live-chat-renderer-0');

    const timeDisplayCheck = document.querySelector('.ytp-time-display').classList.contains('ytp-live');
    const chatCheck = (document.body.contains(chatApp) || document.body.contains(chatHeader));

    return (timeDisplayCheck || chatCheck);
}

const pageLoad = () => {
    const YTG_APP = document.getElementsByTagName('ytg-app')[0];

    return new Promise((res, rej) => {
        const eventHandler = e => {
            YTG_APP.removeEventListener('yt-action', eventHandler);
            res();
        }
        
        YTG_APP.addEventListener('yt-action', eventHandler);
    });
}

// ---

const main = () => {
    if(!isLivestreamPage()) return;

    /** 
     * If memory usage becomes a problem, these instances might
     * need to be helped into garbage collection. E.g. setting
     * them to null on route change to main 'YouTube Gaming' title.
     */  
    const chatWatcher = new ChatWatcher;
    
}

const routeWatcher = new RouteWatcher;

routeWatcher.on('change', () => {
    // console.log('newPage');
    main();
});

pageLoad().then(main);
