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
        this.ui.setCoachmarkId(ContentStore.NewCoachmarkId);
        this.ui.setStepId(null);
        this.ui.setEditCoachmarkMode(true);
        this.ui.setPageType(UiStore.PTCoachmarkEdit);
        this.content.setCurrentCoachmark({
            id: ContentStore.NewCoachmarkId,
            name: '',
            steps: [],
            createdBy: 'someUser',
            readonlyUsers: [],
            readWriteUsers: [],
        });
    }

    @computed get coachmark() {
        console.log('getting coachmark for id: ', this.ui.coachmarkId);
        return this.content.coachmarks.find(c => c.id === this.ui.coachmarkId);
    }

    @computed get step() {
        let stepId = undefined;
        console.log('getting step for id: ', this.ui.stepId);
        if (!this.ui.stepId) {
            const coachmark = this.coachmark;
            const firstStep = coachmark.steps[0];
            if (firstStep) {
                stepId = firstStep.id;
            }
        } else {
            stepId = this.ui.stepId;
        }
        return this.content.steps.find(s => s.id === stepId);
    }


    /**
     * @return bool is the user currently creating a new coachmark
     */
    @computed get isNewCoachmark() {
        return this.ui.coachmarkId === ContentStore.NewCoachmarkId;
    }

    /**
     * @return bool can the current user edit this coachmark
     */
    @computed get coachmarkEditable() {
        return true; /** @todo  actually check this... */
    }
    /* Persistance */
    restore() {
        this.ui.restore();
        this.content.restore();
    }
}