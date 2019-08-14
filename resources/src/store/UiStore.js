import { observable, action } from 'mobx';

export default class UiStore {
    @observable mainMenuOpen = false;

    @observable componentSelectMode = false;

    @action.bound toggleMainMenuOpen() {
        this.mainMenuOpen = !this.mainMenuOpen;
    }

    @action setMainMenuOpen(open) {
        this.mainMenuOpen = open;
    }

    @action.bound enableComponentSelectMode() {
        this.componentSelectMode = true;
    }

    @action.bound disableComponentSelectMode() {
        this.componentSelectMode = false;
    }
}
