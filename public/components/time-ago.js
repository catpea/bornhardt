class TimeAgo extends HTMLElement {
  static get observedAttributes() { return ['datetime']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._datetime = null;
    this._timer = null;
    this._container = document.createElement('span');
    this.shadowRoot.appendChild(this._container);
  }

  connectedCallback() {
    this._upgradeProperty('datetime');
    this._startTimer();
  }

  disconnectedCallback() {
    if (this._timer) clearInterval(this._timer);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'datetime') {
      this._datetime = newValue;
      this._render();
    }
  }

  get datetime() {
    return this.getAttribute('datetime');
  }

  set datetime(value) {
    this.setAttribute('datetime', value);
  }

  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  _startTimer() {
    this._render();
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(() => this._render(), 1000 * 30);
  }

  _render() {
    if (!this._datetime) {
      this._container.textContent = '';
      return;
    }
    const timeAgoStr = this._getTimeAgoString(this._datetime);
    this._container.textContent = timeAgoStr;
  }

  _getTimeAgoString(isoDateString) {
    const date = new Date(isoDateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (isNaN(diff)) return 'Invalid date';

    if (diff < 60) return 'just now';
    if (diff < 3600) {
      const m = Math.floor(diff / 60);
      return `${m} minute${m !== 1 ? 's' : ''} ago`;
    }
    if (diff < 86400) {
      const h = Math.floor(diff / 3600);
      return `${h} hour${h !== 1 ? 's' : ''} ago`;
    }
    if (diff < 2592000) {
      const d = Math.floor(diff / 86400);
      return `${d} day${d !== 1 ? 's' : ''} ago`;
    }
    if (diff < 31536000) {
      const mo = Math.floor(diff / 2592000);
      return `${mo} month${mo !== 1 ? 's' : ''} ago`;
    }
    const y = Math.floor(diff / 31536000);
    return `${y} year${y !== 1 ? 's' : ''} ago`;
  }
}

customElements.define('time-ago', TimeAgo);
