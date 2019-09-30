import { action } from 'mobx';
// import Cookies from 'js-cookie';

/**
 * Base class for mobx stores
 * @class BaseCoachmarkStore
 */
export default class BaseCoachmarksStore {
  /**
   * Return the name for this store's localStorage object. Overriden in child classes.
   * @return string
   */
  cookieName() {
    return '';
  }

  /**
   * Properties to skip during state write/restore. Overriden in child classes
   * @return string[]
   */
  skipProperties() {
    return [];
  }

  /**
   * Serialize the store as a JSON object, skipping specified attributes.
   * @return string
   */
  serialize() {
    const data = {};
    Object.keys(this)
        .filter(key => key.indexOf('_') === 0 && this[key] !== undefined && !this.skipProperties().includes(key))
        .forEach(key => {
            data[key] = this[key];
        });
    
    return JSON.stringify(data);
  }

  /**
   * Deserialize state from JSON object
   * @param {string} json
   * @return null
   */
  @action.bound deserialize(json) {
    try {
      if (!json) {
        this.reset();
        return;
      }
      const data = JSON.parse(json);
      Object.keys(data)
        .filter(key => data[key] !== undefined && !this.skipProperties().includes(key))
        .forEach(key => this.set(key, data[key], false));
    } catch (e) {
      console.error(e);
      console.log(json);
      console.error('reseting');
      this.reset();
    }
  }

  /**
   * Write current state as JSON to localStorage
   * @return null
   */
  writeState() {
    console.log('writeState', this.cookieName());
    localStorage.setItem(this.cookieName(), this.serialize());
    
  }

  /**
   * Restore stage from localStorage
   * @return null
   */
  @action.bound restore() {
    const state = localStorage.getItem(this.cookieName());
    this.deserialize(state);
  }

  /**
   * Set some default values for the store, overridden in child classes
   * @return null
   */
  @action.bound reset() {
    
  }

  /**
   * Generic setter. Writes state after setting value
   * @param {string} prop
   * @param {*} val
   * @param {boolean} write
   * @return null
   */
  @action.bound set(prop, val, write = true) {
    this[prop] = val;
    if (write) {
      this.writeState();
    }
  }
}
