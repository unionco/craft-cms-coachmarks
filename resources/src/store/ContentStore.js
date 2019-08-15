import { observable, action, runInAction, toJS } from 'mobx';

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
        label: 'Click on entries on the left panel'
      },
      {
        id: 2,
        name: 'Click on entries in the left panel',
        description: 'Click on entries in the left panel',
        label: 'Click on entries on the left panel'
      }
    ]
  },
  {
    id: 2,
    name: 'Create an entry'
  }
];

const getCoachmarks = () => new Promise(resolve => {
    setTimeout(() => {
      resolve({
        coachmarks
      });
    }, 500);
  });

export default class ContentStore {
  @observable debug = '';

  @observable coachmarks = [];

  @observable currentCoachmark = {};

  @observable coachmarksState = 'uninitialized';

  @action.bound appendDebug(output) {
    this.debug = `${this.debug}<br/>${output}`;
  }

  @action async fetchCoachmarks() {
    this.coachmarks = [];
    this.coachmarksState = 'loading';
    try {
      const result = await getCoachmarks();
      runInAction(() => {
        this.coachmarksState = 'complete';
        this.coachmarks = result.coachmarks;
        console.log('loaded coachmarks');
        console.log(toJS(this.coachmarks));
      });
    } catch (err) {
      runInAction(() => {
        this.coachmarksState = 'error';
      });
    }
  }

  serialize() {
    return JSON.stringify({
      debug: toJS(this.debug),
      coachmarks: toJS(this.coachmarks),
      coachmarksState: toJS(this.coachmarksState),
      currentCoachmark: toJS(this.currentCoachmark),
    });
  }

  @action deserialize(json) {
    try {
      const state = JSON.parse(json);
      this.debug = state.debug;
      this.coachmarks = state.coachmarks;
      this.currentCoachmark = state.currentCoachmark;
      this.coachmarksState = state.coachmarksState;
    } catch (err) {
      this.debug = '';
      this.coachmarks = [];
      this.currentCoachmark = {};
      this.coachmarksState = 'uninitialized';
    }
  }
}
