import { observable, action, runInAction, toJS, computed } from 'mobx';
import { getCoachmarks as getCoachmarksApi } from '../api/Coachmarks';
import { getUsers as getUsersApi, getCurrentUser } from '../api/Users';
import BaseCoachmarksStore from './BaseCoachmarksStore';

export default class ContentStore extends BaseCoachmarksStore {
  constructor(rootStore) {
    super();
    this.rootStore = rootStore;
  }

  /** @inheritdoc */
  cookieName() {
    return 'cm-content';
  }

  /** @inheritdoc */
  skipProperties() {
    return ['_coachmarks', '_coachmarksState', '_coachmarkSaveState'];
  }


  /** ID to use for coachmarks/steps indicating it it is new */
  static NewCoachmarkId = -1;

  /** Statuses */
  static StateLoading = 'loading';
  static StateUninit = 'uninit';
  static StateError = 'error';
  static StateComplete = 'complete';

  /**
   * Reference back to root mobx store
   */
  rootStore = undefined;

  /**
   * @var {array} _coachmarks array of coachmarks (w/ steps)
   */
  @observable _coachmarks = [];

  /**
   * @var {array} _users array of user objects
   */
  @observable _users = [];

  /**
   * @var {string} _coachmarksState status for coachmarks API call
   */
  @observable _coachmarksState = ContentStore.StateUninit;

  /**
   * @var {string} _usersState status for users API call
   */
  @observable _usersState = ContentStore.StateUninit;

  /**
   * @var {number} _currentUser current user ID
   */
  @observable _currentUser = -1;

  /** @inheritdoc */
  @action.bound reset() {
    this._coachmarks = [];
    this._users = [];
    this._coachmarkSaveState = ContentStore.StateUninit;
    this._coachmarkState = ContentStore.StateUninit;
    this._usersState = ContentStore.StateUninit;
  }

  /**
   * Set the coachmarks array
   * @param {array} cm 
   * @return {null}
   */
  @action.bound setCoachmarks(cm) {
    this._coachmarks = cm;
  }


  /**
   * Get the coachmarks array
   * @return {array}
   */
  @computed get coachmarks() {
    return this._coachmarks;
  }

  /**
   * Set the coachmarks loading status. Should use constants/statics as valid statuses
   * @param {string} state 
   */
  @action.bound setCoachmarksState(state) {
    this._coachmarksState = state;
  }

  /**
   * Get the coachmarks loading status
   * @return {string}
   */
  @computed get coachmarksState() {
    return this._coachmarksState;
  }

  /**
   * Load coachmarks (w/steps) for the current user from the backend.
   * Optionally run in the background (don't update loading state)
   * @param {boolean|null} background
   * @return {null}
   */
  @action async fetchCoachmarks(background = false) {
    console.log('ContentStore.fetchCoachmarks()');
    this._coachmarks = [];
    if (!background) {
      this._coachmarksState = ContentStore.StateLoading;
    }
    try {
      const result = await getCoachmarksApi();
      //   debugger;
      runInAction(() => {
        if (!background) {
          this._coachmarksState = ContentStore.StateComplete;
        }
        this.set('_coachmarks', result, false); // _coachmarks = result;
        console.log(toJS(result));
      });
    } catch (err) {
      runInAction(() => {
        if (!background) {
          this._coachmarksState = ContentStore.StateError;
        }
      });
    }
  }

  /**
   * Get the array of step objects for the current coachmark (based on `get coachmark()`)
   * @return {array}
   */
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

  /**
   * Convenience method to see if all backend requests are complete
   * @return {boolean}
   */
  @computed get loaded() {
    return (
      this.coachmarksState === ContentStore.StateComplete &&
      this.usersState === ContentStore.StateComplete
    );
  }

  /**
   * Get the current state for users (loading, error, complete, uninit, etc)
   * @return {string}
   */
  @computed get usersState() {
    return this._usersState;
  }

  /**
   * Set the users array
   * @param {array} users
   * @return {null}
   */
  @action.bound setUsers(users) {
    this._users = users;
  }

  /**
   * Get an array of all user objects
   * @return {array}
   */
  @computed get users() {
    return this._users;
  }

  /**
   * Get the current user ID
   * @return {null|Number}
   */
  @computed get currentUser() {
      return this._currentUser;
  }

  /**
   * Load the users from the backend, setting state once the request is complete
   * @return {null}
   */
  @action.bound async fetchUsers() {
    console.log('ContentStore.fetchUsers');
    this._users = [];
    this._currentUser = undefined;
    this._usersState = ContentStore.StateLoading;
    try {
      const users = await getUsersApi();
      const currentUser = await getCurrentUser();
      runInAction(() => {
        this._usersState = ContentStore.StateComplete;
        this.set('_users', users.users, false);
      });
      runInAction(() => {
        this.set('_currentUser', parseInt(currentUser.user, 10), false);
      });
    } catch (err) {
      runInAction(() => {
        this._usersState = ContentStore.StateError;
      });
    }
  }

  /**
   * Get the user for the given ID
   * @param {*} id 
   * @return {null|object}
   */
  getUser(id) {
    if (this.usersState !== ContentStore.StateComplete) {
      return null;
    }
    return this.users.find(u => u.id === id);
  }

  /**
   * Get the coachmark for the given id
   * @param {*} coachmarkId 
   * @return {null|object}
   */
  getCoachmark(coachmarkId) {
    const coachmark = this._coachmarks.filter(c => c.id === coachmarkId);
    if (coachmark.length) {
      return coachmark[0];
    }
    return coachmark;
  }

  /**
   * Get an array of steps for the given coachmark. If coachmark not specified, use the current
   * coachmark (see `get coachmark()`, below)
   * @param {*} coachmarkId
   * @return {array}
   */
  getCoachmarkSteps(coachmarkId = null) {
    if (!coachmarkId || coachmarkId instanceof Event) {
      coachmarkId = this.rootStore.ui.coachmarkId;
    }
    const coachmark = this.getCoachmark(coachmarkId);
    if (coachmark) {
      console.log(toJS(coachmark));
      return coachmark.steps;
    }
    return [];
  }

  /**
   * Return the current coachmark, based on the UI Store coachmarkId attribute
   * @return {false|object}
   */
  @computed get coachmark() {
    const { coachmarkId } = this.rootStore.ui;
    const coachmarks = this.coachmarks.filter(
      coachmark => coachmark.id === coachmarkId
    );
    if (coachmarks.length) {
      return coachmarks[0];
    }
    return false;
  }

  /**
   * Return the current step, based on the UI Store stepId attribute
   * @return {false|object}
   */
  @computed get step() {
    const { stepId } = this.rootStore.ui;
    const coachmark = this.coachmark;
    if (coachmark) {
      const steps = coachmark.steps.filter(step => step.id === stepId);
      if (steps.length) {
        return steps[0];
      }
    }
    return false;
  }

  /**
   * Get step by ID
   * @param {*} id
   * @return {null|object}
   */
  getStep(id) {
      const steps = this.steps.filter(step => step.id === id);
      if (steps.length) {
          return steps[0];
      }
      return null;
  }

  /**
   * Return whether the current user can edit a coachmark with the given ID
   * @param {*} id Coachmark ID
   * @return {boolean}
   */
  userCanEditCoachmark(id) {
    const coachmark = this.getCoachmark(id);
    if (!coachmark) {
      return false;
    }
    return coachmark.readWriteUsers.includes(this._currentUser);
  }

  /**
   * Return whether the current user can create coachmarks
   * @return {boolean}
   */
  @computed get userCanCreateCoachmark() {
      const user = this.getUser(this.currentUser);
      if (!user) {
          console.warn('Current user is null');
          return false;
      }
      return user.createCoachmarks;
  }
}
