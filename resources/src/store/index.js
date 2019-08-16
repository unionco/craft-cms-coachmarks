import { observable, action, computed } from 'mobx';
import UiStore from './UiStore';
import ContentStore from './ContentStore';

export default class RootStore {
    @observable ui = new UiStore();

    @observable content = new ContentStore();

    /** Navigation */
    @action.bound goToCoachmark(id) {
        this.ui.setCoachmarkId(id);
        this.ui.setPageType(UiStore.PTCoachmarkDetail);
    }

    @action.bound goToMainMenu() {
        this.ui.setPageType(UiStore.PTMainMenu);
        this.ui.setCoachmarkId(null);
        this.ui.setStepId(null);
        this.ui.setEditCoachmarkMode(false);
    }

    @action.bound editCoachmark(id) {
        this.ui.setCoachmarkId(id);
        this.ui.setPageType(UiStore.PTCoachmarkEdit);
        this.ui.setEditCoachmarkMode(true);
    }

    @action.bound createNewCoachmark() {
        console.log('hook me up');
    }

    @computed get coachmark() {
        console.log('getting coachmark for id: ', this.ui.coachmarkId);
        return this.content.coachmarks.find(c => c.id === this.ui.coachmarkId);
    }

    @action.bound getStep(id) {
        return this.content.steps.find(s => s.id === id);
    }


    @computed get isNewCoachmark() {
        return this.ui.coachmarkId === ContentStore.NewCoachmarkId;
    }

    /* Persistance */
    restore() {
        this.ui.restore();
        this.content.restore();
    }
}