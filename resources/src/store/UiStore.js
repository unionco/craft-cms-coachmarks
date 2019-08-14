import { observable, action } from 'mobx';

export default class UiStore {
    @observable open = false;

    @observable pageType = 'mainMenu';
       
    @observable coachmarkId = undefined;

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
}
