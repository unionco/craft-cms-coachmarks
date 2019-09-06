import { observable, action, computed, toJS } from 'mobx';
import { newCoachmark, getCoachmarkById } from '../api/Coachmarks';
import ContentStore from './ContentStore';
import BaseCoachmarksStore from './BaseCoachmarksStore';

export default class CurrentCoachmarkStore extends BaseCoachmarksStore {
  @observable _id = 0;
  @observable _title = '';
  @observable _readOnlyUsers = [];
  @observable _readWriteUsers = [];

  @observable _saveStatus = ContentStore.StateUninit;

  @action.bound reset() {
    this._id = 0;
    this._title = '';
    this._readOnlyUsers = [];
    this._readWriteUsers = [];
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
    console.log('start current coachmark save');
    const result = await newCoachmark({
      id: toJS(this.id),
      title: toJS(this.title),
      readOnlyUsers: toJS(this.readOnlyUsers),
      readWriteUsers: toJS(this.readWriteUsers),
    });
    //   console.log(result);
    if (result.success && result.id) {
      this._saveStatus = ContentStore.StateComplete;
      this.setId(result.id);
    } else {
      this._saveStatus = ContentStore.StateError;
    }
  }

  cookieName() {
    return 'cm-current-coachmark';
  }
}
