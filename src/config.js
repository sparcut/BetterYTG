const CONFIG = {
  defaultOptions: {
    // Emote Options
    enableTwitchEmotes: true,
    enableBetterYTGEmotes: true,
    
    // Chat Options
    removeChatAvatars: true,
    enableChatColors: true,
    separateChatLines: false,
    
    // Ice Options (Ice_Poseidon)
    enableOldIceEmotes: false,
    iceEnableLiveIcon: false,
    iceEnableLiveNotification: false,
    iceEnableNotificationSound: false,
    iceNotificationVolume: 0.6
  },
  
  iceOptions: {
    enableOldIceEmotes: true,
    iceEnableLiveIcon: true,
    iceEnableLiveNotification: true,
    iceEnableNotificationSound: true,
  },

  iceLiveCheck: {
    url: 'http://107.170.95.160/live/',
    interval: 30000
  }
}

export default CONFIG;
