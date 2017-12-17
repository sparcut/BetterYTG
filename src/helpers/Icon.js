import OpenActiveTab from './OpenActiveTab';

class Icon {
  constructor() {
    this._colors = [ 'red', 'grey', 'purple' ];
    this._sizes = [ '16', '48', '128' ];
    this._path = './assets/icons/';

    this.paths = {}
    this.onClickUrls = {
      'red': '*://gaming.youtube.com/',
      'grey': chrome.extension.getURL('html/setup.html'),
      'purple': '*://gaming.youtube.com/ice_poseidon/live/'
    }

    this._createPaths();
    this._bindOnClick();
  }

  _filename(color, size) {
    return `BetterYTG_${color}_${size}.png`;
  }

  _createPaths() {
    this._colors.forEach(color => {
      this.paths[color] = {};
      this._sizes.forEach(size => {
        this.paths[color][size] = this._path + this._filename(color, size);
      });
    });
  }

  _bindOnClick() {
    chrome.browserAction.onClicked.addListener(() => {
      const url = this.onClickUrls[this.currentColor];
      OpenActiveTab(url);
    });
  }

  set(color) {
    this.currentColor = color;
    chrome.browserAction.setIcon({ path: this.paths[color] });
  }

  setBadgeText(text) {
    chrome.browserAction.setBadgeText({ text });
  }

  setBadgeBackgroundColor(color) {
    chrome.browserAction.setBadgeBackgroundColor({ color });
  }
}

export default new Icon;
