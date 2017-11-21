class Icon {
  constructor() {
    this._colors = [ 'red', 'grey', 'purple' ];
    this._sizes = [ '16', '48', '128' ];
    this._path = './assets/icons/';

    this.paths = {}

    this._createPaths();
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

  set(color) {
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