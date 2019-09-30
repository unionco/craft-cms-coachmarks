import { observable, action, computed, toJS } from 'mobx';
import { saveCoachmark } from '../api/Coachmarks';
import ContentStore from './ContentStore';
import BaseCoachmarksStore from './BaseCoachmarksStore';

export default class CurrentCoachmarkStore extends BaseCoachmarksStore {
  constructor(rootStore) {
      super();
      this.rootStore = rootStore;
  }
  /**
   * @var {Object} rootStore reference to the root store
   */
  rootStore = undefined;

  /**
   * @var {Number} _id current coachmark ID
   */
  @observable _id = 0;

  /**
   * @var {string} _title current coachmark title
   */
  @observable _title = '';

  /**
   * @var {array} _readOnlyUsers
   */
  @observable _readOnlyUsers = [];

  /**
   * @var {array} _readWriteUsers
   */
  @observable _readWriteUsers = [];

  /**
   * @var {string} _saveStatus
   */
  @observable _saveStatus = ContentStore.StateUninit;

  /**
   * Get the most recent save status
   * @return {string}
   */
  @computed get saveStatus() {
      return this._saveStatus;
  }

  /**
   * Set the save status
   * @param {string} status 
   */
  @action.bound setSaveStatus(status) {
      console.log('setSaveStatus: ', status);
      this._saveStatus = status;
  }

  /** @inheritdoc */
  @action.bound reset() {
    this._id = 0;
    this._title = '';
    this._readOnlyUsers = [];
    this._readWriteUsers = [];
    this._saveStatus = ContentStore.StateUninit;
  }

  /**
   * Set the current coachmark ID
   * @param {Number} id 
   */
  @action.bound setId(id) {
    this._id = id;
    this.writeState();
  }

  /**
   * Get the current coachmark ID
   */
  @computed get id() {
    return this._id;
  }

  /**
   * Set the current coachmark title
   * @param {string} title 
   */
  @action.bound setTitle(title) {
    this._title = title;
    this.writeState();
  }

  /**
   * Get the current coachmark title
   * @return {string}
   */
  @computed get title() {
    return this._title;
  }

  /**
   * Set the array of read only user IDs
   * @param {array} users array of ints
   */
  @action.bound setReadOnlyUsers(users) {
    this._readOnlyUsers = users.map(user => parseInt(user, 10)).filter(user => user);
    this.writeState();
  }

  /**
   * Get array of read only user IDs
   * @return {array}
   */
  @computed get readOnlyUsers() {
    return this._readOnlyUsers || [];
  }

  /**
   * Set the array of read/write user IDs
   * @param {array} users array of ints
   */
  @action.bound setReadWriteUsers(users) {
    this._readWriteUsers = users.map(user => parseInt(user, 10)).filter(user => user);
    this.writeState();
  }

  /**
   * Get array of read/write user IDs
   * @return {array}
   */
  @computed get readWriteUsers() {
    return this._readWriteUsers || [];
  }

  /**
   * Set all current coachmark attributes in one call
   * @param {Object} cm 
   */
  @action.bound setCurrentCoachmark(cm) {
    this._title = cm.title;
    this._id = cm.id;
    this._readOnlyUsers = cm.readOnlyUsers;
    this._readWriteUsers = cm.readWriteUsers;
    this.writeState();
  }

  /**
   * Save the current coachmark, updating save status along the way
   * @return {Object}
   */
  @action.bound async save() {
    this.setSaveStatus(ContentStore.StateLoading);
    
    // DEBUG
    // await new Promise((resolve) => {
    //     setTimeout(() => resolve(true), 500);
    // });
    const result = await saveCoachmark({
      id: toJS(this.id),
      title: toJS(this.title),
      readOnlyUsers: toJS(this.readOnlyUsers),
      readWriteUsers: toJS(this.readWriteUsers),
    });
    
    if (result.success && result.id) {
      this.setSaveStatus(ContentStore.StateComplete);
      this.setId(result.id);
      // On success, reload the available coachmarks in the background
      this.rootStore.content.fetchCoachmarks(true);
    } else {
      this.setSaveStatus(ContentStore.StateError);
    }
    return result;
  }

  /** @inheritdoc */
  cookieName() {
    return 'cm-current-coachmark';
  }
}
