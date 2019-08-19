import { observable, action, runInAction, toJS, computed } from 'mobx';
import Cookies from 'js-cookie';
import { getCoachmarks as getCoachmarksApi } from '../api/Coachmarks';
import { getUsers as getUsersApi } from '../api/Users';
/**
 * Mock data until backend is ready
 */
// const coachmarks = [
//   {
//     id: 1,
//     name: 'Get started',
//     readOnly: true,
//     steps: [
//       {
//         id: 1,
//         coachmarkId: 1,
//         name: 'Click on entries in the left panel',
//         description: 'Click on entries in the left panel',
//         label: 'Click on entries on the left panel',
//         url: '/relative',
//         order: 1,
//         selectorNode: '.node-here',
//         tooltipPosition: 'top',
//       },
//       {
//         id: 2,
//         coachmarkId: 1,
//         name: 'Click on entries in the left panel',
//         description: 'Click on entries in the left panel',
//         label: 'Click on entries on the left panel',
//         url: '/relative',
//         order: 2,
//         selectorNode: '.node-here',
//         tooltipPosition: 'top',
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: 'Create an entry',
//     readOnly: true,
//     steps: [],
//   },
// ];

// const users = [
//   {
//     id: 99,
//     name: 'Admin',
//   },
//   {
//     id: 100,
//     name: 'Client 1',
//   },
//   {
//     id: 101,
//     name: 'Account Manager',
//   },
// ];

// const getCoachmarks = () => new Promise(resolve => {
//     setTimeout(() => {
//       resolve({
//         coachmarks,
//       });
//     }, 500);
//   });

// const getUsers = () => new Promise(resolve => {
//     setTimeout(() => {
//       resolve({
//         users,
//       });
//     }, 300);
//   });

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

  @action.bound setCoachmarks(cm) {
    this._coachmarks = cm;
    this.writeState();
  }

  @computed get coachmarks() {
    return this._coachmarks;
  }

  /** Current Coachmark */
  @observable _currentCoachmark = {};

  @action.bound setCurrentCoachmark(cm) {
    this._currentCoachmark = cm;
    this.writeState();
  }

  @computed get currentCoachmark() {
    return this._currentCoachmark;
  }

  /** Current Step */
  @observable _currentStep = {};
  @action.bound setCurrentStep(step) {
      this._currentStep = step;
      this.writeState();
  }
  @computed get currentState() {
      return this._currentStep;
  }


  /** Coachmarks State */
  @observable _coachmarksState = this.StateUninit;

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
        this.setCoachmarks(result.coachmarks); //_coachmarks = result;
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

  @observable _users = [];
  @observable _usersState = ContentStore.StateUninit;
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
      _coachmarks: toJS(this._coachmarks),
      _coachmarksState: toJS(this._coachmarksState),
      _currentCoachmark: toJS(this._currentCoachmark),
      _users: toJS(this._users),
      _usersState: toJS(this._usersState),
      _currentStep: toJS(this._currentStep),
    });
  }

  @action deserialize(json) {
    try {
      const state = JSON.parse(json);
      //   this = {...this, ...state};
      // Object.merge({}, this, state);
      this.debug = state.debug;
      this._coachmarks = state._coachmarks;
      this._users = state._users;
      this._currentCoachmark = state._currentCoachmark;
      this._coachmarksState = state._coachmarksState;
      this._currentStep = state._currentStep;
    } catch (err) {
      this.debug = '';
      this._coachmarks = [];
      this._users = [];
      this._currentCoachmark = {};
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
