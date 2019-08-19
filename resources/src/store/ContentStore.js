import { observable, action, runInAction, toJS, computed } from 'mobx';
import Cookies from 'js-cookie';
import { getCoachmarks as getCoachmarksApi, newCoachmark } from '../api/Coachmarks';
import { getUsers as getUsersApi } from '../api/Users';

export default class ContentStore {
  static CookieName = 'cm-content';

  static NewCoachmarkId = -1;

  /** Statuses */
  static StateLoading = 'loading';
  static StateUninit = 'uninit';
  static StateError = 'error';
  static StateComplete = 'complete';

  @observable debug = '';

  /** Coachmarks */
  @observable _coachmarks = [];
  @observable _users = [];

  @observable _coachmarksState = ContentStore.StateUninit;
  @observable _coachmarkSaveState = ContentStore.StateUninit;
  @observable _usersState = ContentStore.StateUninit;
  
//   @observable _currentCoachmark = {};
  @observable _currentStep = {};
  
  

  @action.bound setCoachmarks(cm) {
    this._coachmarks = cm;
    this.writeState();
  }

  @computed get coachmarks() {
    return this._coachmarks;
  }

  /** Current Coachmark */

  
  /** Current Step */

  @action.bound setCurrentStep(step) {
    this._currentStep = step;
    this.writeState();
  }
  @computed get currentState() {
    return this._currentStep;
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
    this._coachmarks = [];
    this._coachmarksState = ContentStore.StateLoading;
    try {
      const result = await getCoachmarksApi();
      //   debugger;
      runInAction(() => {
        this._coachmarksState = ContentStore.StateComplete;
        this.setCoachmarks(result.coachmarks); // _coachmarks = result;
        console.log(result);
        // console.log('loaded coachmarks');
        // console.log(toJS(this.coachmarks));
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
    return this.coachmarksState === ContentStore.StateComplete;
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
    this._users = [];
    this._usersState = ContentStore.StateLoading;
    try {
      const result = await getUsersApi();
      runInAction(() => {
        this._usersState = ContentStore.StateComplete;
        this.setUsers(result.users); // = result.coachmarks;
        // console.log('loaded users');
        // console.log(toJS(this._users));
      });
    } catch (err) {
      runInAction(() => {
        this._usersState = ContentStore.StateError;
      });
    }
  }

  /** Persistance */
  writeState() {
    Cookies.set(ContentStore.CookieName, this.serialize());
  }

  restore() {
    const state = Cookies.get(ContentStore.CookieName);
    this.deserialize(state);
  }
  serialize() {
    return JSON.stringify({
      debug: toJS(this.debug),
    //   _coachmarks: toJS(this._coachmarks),
    //   _coachmarksState: toJS(this._coachmarksState),
    //   _currentCoachmark: toJS(this._currentCoachmark),
    //   _users: toJS(this._users),
    //   _usersState: toJS(this._usersState),
      _currentStep: toJS(this._currentStep),
    });
  }

  @action deserialize(json) {
    try {
      const state = JSON.parse(json);
      //   this = {...this, ...state};
      // Object.merge({}, this, state);
    //   this.debug = state.debug;
    //   this._coachmarks = state._coachmarks;
    //   this._users = state._users;
    //   this._currentCoachmark = state._currentCoachmark;
    //   this._coachmarksState = state._coachmarksState;
      this._currentStep = state._currentStep;
    } catch (err) {
      this.debug = '';
      this._coachmarks = [];
      this._users = [];
    //   this._currentCoachmark = {};
      this._coachmarksState = ContentStore.StateUninit;
      this._usersState = ContentStore.StateUninit;
      this._currentStep = {};
    }
  }
  // @action setX(x) {
  //   this.x = x;
  //   this.writeState();
  // }

  // get x() {
  // this.deser
  //   }
}
