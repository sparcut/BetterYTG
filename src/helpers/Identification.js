export const isLivestream = () => {
    const timeDisplay = document.querySelector('.ytp-time-display');
    const chatApp = document.querySelector('yt-live-chat-app');
    const chatHeader = document.querySelector('.yt-live-chat-renderer-0');
    
    const timeDisplayCheck = timeDisplay && timeDisplay.classList.contains('ytp-live');
    const chatCheck = (document.body.contains(chatApp) || document.body.contains(chatHeader));

    return (timeDisplayCheck || chatCheck);
}

// isYoutubeGaming checks for the presence of ytg-app, the top level element for YT Gaming
export const isYoutubeGaming = () => {
    return !!document.querySelector('ytg-app');
}

// isYoutubeEmbed checks that this is an iframe, and it is **not** loaded from youtube.com (main site uses embed too)
export const isYoutubeEmbed = () => {
    // If the frameElement is available, then CORS means that we must be on youtube.com.
    if (window.frameElement) return false;

    // If the window location isn't the parent location, then we are in an iframe.
    return (window.location != window.parent.location);
}

// isYoutubeEmbed checks that this is an iframe, and it is being used on youtube.com
export const isYoutubeVanilla = () => {
    // window.frameElement is only available from youtube.com sites from within iframe per CORS
    return !!window.frameElement;
}