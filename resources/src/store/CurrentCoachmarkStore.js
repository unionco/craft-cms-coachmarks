import { observable, action, computed, toJS } from 'mobx';
import { newCoachmark, getCoachmarkById } from '../api/Coachmarks';
import ContentStore from './ContentStore';

export default class CurrentCoachmarkStore {
  @observable _id = 0;
  @observable _title = '';
  @observable _readOnlyUsers = [];
  @observable _readWriteUsers = [];

  @observable _saveStatus = ContentStore.StateUninit;

  @action.bound reset() {
    this.id = 0;
    this.title = '';
    this.readOnlyUsers = [];
    this.readWriteUsers = [];
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

  @action.bound set(cm) {
    this.setTitle(cm.title);
    this.setId(cm.id);
    this.setReadOnlyUsers(cm.readOnlyUsers);
    this.setReadWriteUsers(cm.readWriteUsers);
    this.writeState();
  }

  @computed get currentCoachmark() {
    return this._currentCoachmark;
  }

  @action.bound async save() {
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

  writeState() {
    
  }
}
