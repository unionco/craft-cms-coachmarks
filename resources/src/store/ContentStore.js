import { observable, action, runInAction, toJS, computed } from 'mobx';
import Cookies from 'js-cookie';
/**
 * Mock data until backend is ready
 */
const coachmarks = [
  {
    id: 1,
    name: 'Get started',
    steps: [
      {
        id: 1,
        name: 'Click on entries in the left panel',
        description: 'Click on entries in the left panel',
        label: 'Click on entries on the left panel',
      },
      {
        id: 2,
        name: 'Click on entries in the left panel',
        description: 'Click on entries in the left panel',
        label: 'Click on entries on the left panel',
      },
    ],
  },
  {
    id: 2,
    name: 'Create an entry',
    steps: [],
  },
];

const getCoachmarks = () => new Promise(resolve => {
    setTimeout(() => {
      resolve({
        coachmarks,
      });
    }, 500);
  });

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
      const result = await getCoachmarks();
      runInAction(() => {
        this._coachmarksState = this.StateComplete;
        this._coachmarks = result.coachmarks;
        console.log('loaded coachmarks');
        console.log(toJS(this.coachmarks));
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
    });
  }

  @action deserialize(json) {
    try {
      const state = JSON.parse(json);
      //   this = {...this, ...state};
      // Object.merge({}, this, state);
      this.debug = state.debug;
      this._coachmarks = state._coachmarks;
      this._currentCoachmark = state._currentCoachmark;
      this._coachmarksState = state._coachmarksState;
    } catch (err) {
      this.debug = '';
      this._coachmarks = [];
      this._currentCoachmark = {};
      this._coachmarksState = ContentStore.StateUninit;
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
