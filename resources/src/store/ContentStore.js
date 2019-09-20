import { observable, action, runInAction, toJS, computed } from 'mobx';
import Cookies from 'js-cookie';
import {
  getCoachmarks as getCoachmarksApi,
  newCoachmark,
} from '../api/Coachmarks';
import { getUsers as getUsersApi } from '../api/Users';
import BaseCoachmarksStore from './BaseCoachmarksStore';

export default class ContentStore extends BaseCoachmarksStore {
  cookieName() {
    return 'cm-content';
  }

  skipProperties() {
    return ['_coachmarks', '_coachmarksState', '_coachmarkSaveState'];
  }

  static CookieName = 'cm-content';

  static NewCoachmarkId = -1;

  /** Statuses */
  static StateLoading = 'loading';
  static StateUninit = 'uninit';
  static StateError = 'error';
  static StateComplete = 'complete';

  /** Coachmarks */
  @observable _coachmarks = [];
  @observable _users = [];

  @observable _coachmarksState = ContentStore.StateUninit;
  @observable _coachmarkSaveState = ContentStore.StateUninit;
  @observable _usersState = ContentStore.StateUninit;

  //   @observable _currentCoachmark = {};
//   @observable _currentStep = {};

  @action.bound reset() {
      this._coachmarks = [];
      this._users = [];
      this._coachmarkSaveState = ContentStore.StateUninit;
      this._coachmarkState = ContentStore.StateUninit;
      this._usersState = ContentStore.StateUninit;
  }

  @action.bound setCoachmarks(cm) {
    this._coachmarks = cm;
    this.writeState();
  }

  @computed get coachmarks() {
    return this._coachmarks;
  }

  /** Coachmarks State */

  @action.bound setCoachmarksState(state) {
    this._coachmarksState = state;
    this.writeState();
  }

  @computed get coachmarksState() {
    return this._coachmarksState;
  }

  @action async fetchCoachmarks() {
    console.log('ContentStore.fetchCoachmarks()');
    this._coachmarks = [];
    this._coachmarksState = ContentStore.StateLoading;
    try {
      const result = await getCoachmarksApi();
      //   debugger;
      runInAction(() => {
        this._coachmarksState = ContentStore.StateComplete;
        this.set('_coachmarks', result, false); // _coachmarks = result;
        console.log(toJS(result));
      });
    } catch (err) {
      runInAction(() => {
        this._coachmarksState = ContentStore.StateError;
      });
    }
  }

  @action async saveCoachmark(data) {
    this._coachmarkSaveState = ContentStore.StateUninit;
    this._coachmarkSaveState = ContentStore.StateLoading;
    const result = await newCoachmark(data);
    this._coachmarkSaveState = ContentStore.StateComplete;
    console.log(result);
  }

  @computed get steps() {
    const steps = [];
    this.coachmarks.forEach(coachmark => {
      if (coachmark.steps !== undefined) {
        coachmark.steps.forEach(step => {
          steps.push(step);
        });
      }
    });
    return steps;
  }

  @computed get loaded() {
    return (
      this.coachmarksState === ContentStore.StateComplete &&
      this.usersState === ContentStore.StateComplete
    );
  }

  @computed get usersState() {
    return this._usersState;
  }
  @action.bound setUsers(users) {
    this._users = users;
    this.writeState();
  }
  @computed get users() {
    return this._users;
  }

  @action.bound async fetchUsers() {
    console.log('ContentStore.fetchUsers');
    this._users = [];
    this._usersState = ContentStore.StateLoading;
    try {
      const result = await getUsersApi();
      runInAction(() => {
        this._usersState = ContentStore.StateComplete;
        this.set('_users', result.users, false); // = result.coachmarks;
        // console.log('loaded users');
        // console.log(toJS(this._users));
      });
    } catch (err) {
      runInAction(() => {
        this._usersState = ContentStore.StateError;
      });
    }
  }

  getUser(id) {
      if (this.usersState !== ContentStore.StateComplete) {
          return null;
      }
      return this.users.find(u => u.id === id);
  }
}
