import { observable, action, computed, autorun, toJS } from 'mobx';
import UiStore from './UiStore';
import ContentStore from './ContentStore';
import CurrentCoachmarkStore from './CurrentCoachmarkStore';
import CurrentStepStore from './CurrentStepStore';

export default class RootStore {
  @observable ui = new UiStore();
  @observable content = new ContentStore();
  @observable currentCoachmark = new CurrentCoachmarkStore();
  @observable currentStep = new CurrentStepStore();

  /** Navigation */
  @action.bound goToCoachmark(id = false) {
    if (!id || id instanceof Event) {
      id = this.ui.coachmarkId;
    }
    this.ui.setCoachmarkId(id);
    this.ui.setPageType(UiStore.PTCoachmarkDetail);
  }

  @action.bound goToMainMenu() {
    this.ui.setPageType(UiStore.PTMainMenu);
    this.ui.setCoachmarkId(null);
    this.ui.setStepId(null);
  }

  /**
   * Navigate to the Edit Coachmark view
   * @param {Number|Event|null} id
   */
  @action.bound editCoachmark(id = false) {
    // console.log('editCoachmark', id);
    if (!id || id instanceof Event) {
      id = this.ui.coachmarkId;
    }
    this.ui.setCoachmarkId(id);
    this.ui.setPageType(UiStore.PTCoachmarkEdit);
    const coachmark = this.content.coachmarks.find(c => c.id === id);
    if (!coachmark) {
      console.error('Could not find coachmark with ID: ', id);
      return;
    }
    this.currentCoachmark.setCurrentCoachmark({
      id,
      title: coachmark.title,
      readOnlyUsers: coachmark.readOnlyUsers,
      readWriteUsers: coachmark.readWriteUsers,
    });
  }

  @action.bound startCoachmark(id = false) {
    if (!id || id instanceof Event) {
      id = this.ui.coachmarkId;
    }
    this.ui.setCoachmarkId(id);
    this.ui.setPageType(UiStore.PTCoachmarkPlay);
    if (!this.ui.stepId) {
      const steps = this.content.getCoachmarkSteps(id);
      if (!steps) {
          console.warn('steps is undefined');
          return;
      }
      const stepIds = steps.map(step => step.id);
      this.ui.setSteps(stepIds);
      this.ui.setStepId(stepIds[0]);
    }
  }

  @action.bound createNewCoachmark() {
    this.ui.setCoachmarkId(ContentStore.NewCoachmarkId);
    this.ui.setStepId(null);
    this.ui.setPageType(UiStore.PTCoachmarkEdit);
    this.currentCoachmark.setCurrentCoachmark({
      id: ContentStore.NewCoachmarkId,
      name: '',
      //   steps: [],
      //   createdBy: 'someUser',
      readonlyUsers: [],
      readWriteUsers: [],
    });
  }

  @action.bound editSteps() {
    this.ui.setPageType(UiStore.PTStepsEdit);
  }

  @action.bound editStep(id) {
    this.ui.setCoachmarkId(id);
    this.ui.setPageType(UiStore.PTStepEdit);
  }

  @action.bound newStep() {
    this.ui.setPageType(UiStore.PTStepEdit);
    this.currentStep.configure({
      id: ContentStore.NewCoachmarkId,
      coachmarkId: this.ui.coachmarkId,
      label: '',
      nodeSelector: '',
      tooltipPosition: 'bottom',
      order: 1,
    });
  }

  @computed get coachmark() {
    // console.log('getting coachmark for id: ', this.ui.coachmarkId);
    return this.content.coachmarks.find(c => c.id === this.ui.coachmarkId);
  }

  @computed get step() {
    let stepId;
    // console.log('getting step for id: ', this.ui.stepId);
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
   * @return array of steps for the current coachmark (ui.coachmarkId)
   */
  @computed get stepsForCoachmark() {
    if (!this.ui.coachmarkId) {
      return [];
    }
    return this.content.steps.filter(
      step => step.coachmarkId === this.ui.coachmarkId
    );
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
    this.currentCoachmark.restore();
    this.currentStep.restore();
  }

  @action.bound toggleStepActive() {
    const selector = this.step.selectorNode;
    const element = document.querySelector(selector);
    const rect = element.getBoundingClientRect();
    this.ui.setStepBoxPosition(rect);
    console.log(element);

    this.ui._stepActive = !this.ui._stepActive;
    if (this.ui.stepActive) {
      document.body.classList.add('u-coachmarks');
    } else {
      document.body.classList.remove('u-coachmarks');
    }
    this.ui.setTooltipPosition(this.step.tooltipPosition);
  }
}
