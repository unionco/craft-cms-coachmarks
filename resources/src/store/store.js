import { observable, action } from 'mobx';

export default class Store {
    @observable isOpen = false;

    @action.bound toggleOpen() {
        this.isOpen = !this.isOpen;
    }
}
