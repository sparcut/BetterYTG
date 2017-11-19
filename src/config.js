const CONFIG = {
  defaultOptions: {
    // Emote Options
    enableTwitchEmotes: true,
    enableTwitchSubEmotes: true,
    enableBetterTTVEmotes: true,
    emoteChannels: 'monkasen',
    
    // Chat Options
    removeChatAvatars: true,
    enableChatColors: true,
    separateChatLines: false,
    
    // Ice Options (Ice_Poseidon)
    enableIceOldEmotes: false,
    iceEnableLiveIcon: false,
    iceEnableLiveNotification: false,
    iceEnableNotificationSound: false,
    iceNotificationVolume: 0.6
  },
  
  iceOptions: {
    emoteChannels: 'monkasen, trihex, reckful, sodapoppin, b0aty, NightDev',
    enableIceOldEmotes: true,
    iceEnableLiveIcon: true,
    iceEnableLiveNotification: true,
    iceEnableNotificationSound: true,
  },

  iceLiveCheck: {
    url: 'http://107.170.95.160/live',
    interval: 30000
  }
}

export default CONFIG;
