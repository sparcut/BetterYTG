const CONFIG = {
  defaultOptions: {
    // Emote Options
    enableTwitchEmotes: true,
    enableBetterYTGEmotes: true,
    
    // Chat Options
    enableChatColors: true,
    separateChatLines: false,

    // Site Options
    enableYoutubeGaming: true,
    enableYoutubeVanilla: true,
    enableYoutubeEmbed: true,
    
    // Ice Options (Ice_Poseidon)
    enableOldIceEmotes: false,
    iceEnableLiveIcon: false,
    iceEnableLiveNotification: false,
    iceEnablePersistentNotification: false,
    iceEnableNotificationSound: false,
    iceNotificationVolume: 0.5
  },
  
  iceOptions: {
    enableOldIceEmotes: true,
    iceEnableLiveIcon: true,
    iceEnableLiveNotification: true,
    iceEnableNotificationSound: true,
  },

  iceLiveCheck: {
    url: 'https://www.iceposeidon.com/api/v1/live',
    interval: 30000
  }
}

export default CONFIG;
