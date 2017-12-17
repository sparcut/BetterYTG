/* Open new tab if tab is not already open, otherwise focus that tab */

export default url => {
  chrome.tabs.query({ url }, tabs => { // url must be valid match pattern - https://developer.chrome.com/extensions/match_patterns
    if(tabs && tabs.length) {
      // tab.id is not present in some rare cases, so if error around here, that could be the cause.
      chrome.tabs.update(tabs[0].id, { active: true });
    } else {
      chrome.tabs.create({ url });
    }
  });

  // for(let i = 0, tab; tab = tabs[i]; i++) {
  //   if(tab.url && tab.url === url) {
  //     return;
  //   }
  // }
}
