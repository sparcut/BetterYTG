import { pick } from 'lodash';
import EventEmitter from 'events';
import { SyncStorage } from '../utils/chrome';

/**
 * Options helper (class to manage options)
 *
 * @class Options
 * @extends {EventEmitter}
 */
class Options extends EventEmitter {
  constructor() {
    super();

    this._currentOptions = {};

    this._get()
      .then((opts) => {
        this._currentOptions = opts || {};
        this.emit('ready');
      });



    SyncStorage.listen('options', (oldValue, newValue) => {
      this._currentOptions = newValue;
      this.emit('changed', oldValue, newValue);
    });
  }

  /**
   * Set option/s
   *
   * @arg {Object} items (Object of options/s with respective new value)
   * @memberof Options
   */
  set(items) {
    const opts = this.get();
    return SyncStorage.set({ options: Object.assign(opts, items) });
  }

  /**
   * Get option/s from local options property
   *
   * @private
   * @arg {(String|String[])} [items=null] (A string or array of strings corresponding to options/s)
   * @returns {Object} items
   * @memberof Options
   */
  get(items = null) {
    if(items !== null) {
      if(typeof items === 'string') {
        return this._currentOptions[items];
      } else {
        return pick(this._currentOptions, items);
      }
    } else {
      return this._currentOptions;
    }
  }

  /**
   * If options object has specific option
   * 
   * @param {String} item (option to check)
   * @returns {Boolean} doesContain
   * @memberof Options
   */
  has(item) {
    return this._currentOptions.hasOwnProperty(item);
  }

  /**
   * Get option/s from store
   *
   * @private
   * @returns {Promise} option items
   * @memberof Options
   */
  _get() {
    return SyncStorage.get('options');
  }
}

export default new Options;
