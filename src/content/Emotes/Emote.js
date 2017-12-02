class Emote {
  constructor({ code, url }) {
    this.code = code;
    this.url = url;
  }

  get html() {
    return (`
      <span class="BYTG-Emote">
        <img src="${this.url}" alt="${this.code}">
      </span>
    `).trim();
  }
}

export default Emote;