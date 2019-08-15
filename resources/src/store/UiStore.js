import { observable, action, toJS } from 'mobx';

export default class UiStore {
  @observable open = false;

  @observable pageType = 'mainMenu';

  @observable coachmarkId = undefined;

  @observable editCoachmarkMode = false;

  @observable componentSelectMode = false;

  @action.bound toggleOpen() {
    this.open = !this.open;
    console.log('open: ', this.open);
  }

  @action setOpen(open) {
    this.open = open;
  }

  @action.bound enableComponentSelectMode() {
    this.componentSelectMode = true;
  }

  @action.bound disableComponentSelectMode() {
    this.componentSelectMode = false;
  }

  @action goToCoachmark(id) {
    this.pageType = 'coachmarkDetail';
    this.coachmarkId = id;
  }

  serialize() {
    return JSON.stringify({
      open: toJS(this.open),
      pageType: toJS(this.pageType),
      coachmarkId: toJS(this.coachmarkId),
      componentSelectMode: toJS(this.componentSelectMode)
    });
  }

  @action deserialize(json) {
      try {
        const state = JSON.parse(json);
        this.open = state.open;
        this.pageType = state.pageType;
        this.coachmarkId = state.coachmarkId;
        this.componentSelectMode = state.componentSelectMode;
        this.editCoachmarkMode = state.editCoachmarkMode;
      } catch (err) {
          this.open = false;
          this.pageType = 'mainMenu';
          this.coachmarkId = undefined;
          this.componentSelectMode = false;
          this.editCoachmarkMode = false;
      }
  }
}
