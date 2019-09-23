import { observable, action, computed, autorun, toJS } from 'mobx';
import UiStore from './UiStore';
import ContentStore from './ContentStore';
import CurrentCoachmarkStore from './CurrentCoachmarkStore';
import CurrentStepStore from './CurrentStepStore';

export default class RootStore {
  @observable ui = new UiStore(this);
  @observable content = new ContentStore(this);
  @observable currentCoachmark = new CurrentCoachmarkStore(this);
  @observable currentStep = new CurrentStepStore(this);

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
