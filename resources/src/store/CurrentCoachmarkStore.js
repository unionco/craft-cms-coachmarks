import { observable, action, computed, toJS } from 'mobx';
import { saveCoachmark, getCoachmarkById } from '../api/Coachmarks';
import ContentStore from './ContentStore';
import BaseCoachmarksStore from './BaseCoachmarksStore';

export default class CurrentCoachmarkStore extends BaseCoachmarksStore {
  constructor(rootStore) {
      super();
      this.rootStore = rootStore;
  }
  rootStore = undefined;
  @observable _id = 0;
  @observable _title = '';
  @observable _readOnlyUsers = [];
  @observable _readWriteUsers = [];

  @observable _saveStatus = ContentStore.StateUninit;

  @computed get saveStatus() {
      return this._saveStatus;
  }
  @action.bound setSaveStatus(status) {
      console.log('setSaveStatus: ', status);
      this._saveStatus = status;
  }

  @action.bound reset() {
    this._id = 0;
    this._title = '';
    this._readOnlyUsers = [];
    this._readWriteUsers = [];
    this._saveStatus = ContentStore.StateUninit;
  }

  @action.bound setId(id) {
    this._id = id;
    this.writeState();
  }

  @computed get id() {
    return this._id;
  }

  @action.bound setTitle(title) {
    this._title = title;
    this.writeState();
  }

  @computed get title() {
    return this._title;
  }

  @action.bound setReadOnlyUsers(users) {
    this._readOnlyUsers = users;
    this.writeState();
  }

  @computed get readOnlyUsers() {
    return this._readOnlyUsers;
  }

  @action.bound setReadWriteUsers(users) {
    this._readWriteUsers = users;
    this.writeState();
  }

  @computed get readWriteUsers() {
    return this._readWriteUsers;
  }

  @action.bound setCurrentCoachmark(cm) {
    console.error('currentCoachmarkStore::set');
    this._title = cm.title;
    this._id = cm.id;
    this._readOnlyUsers = cm.readOnlyUsers;
    this._readWriteUsers = cm.readWriteUsers;
    this.writeState();
  }

  @computed get currentCoachmark() {
    return this._currentCoachmark;
  }

  @action.bound async save() {
    this.setSaveStatus(ContentStore.StateLoading);
    console.log('start current coachmark save');
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
      this.rootStore.content.fetchCoachmarks(true);
    } else {
      this.setSaveStatus(ContentStore.StateError);
    }
    return result;
  }

  cookieName() {
    return 'cm-current-coachmark';
  }
}
