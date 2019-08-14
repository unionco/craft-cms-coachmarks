import { observable, action, runInAction, toJS } from 'mobx';

// const debug = true;

const getCoachmarks = () => new Promise(resolve => {
    setTimeout(() => {
      resolve({
        coachmarks: [
          {
            id: 1,
            name: 'Get started'
          },
          {
            id: 2,
            name: 'Create an entry'
          }
        ]
      });
    }, 500);
  });

export default class ContentStore {
  @observable debug = '';

  @observable coachmarks = [];

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
}
