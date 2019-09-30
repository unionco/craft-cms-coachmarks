import { observable, action, computed } from 'mobx';
import UiStore from './UiStore';
import ContentStore from './ContentStore';
import CurrentCoachmarkStore from './CurrentCoachmarkStore';
import CurrentStepStore from './CurrentStepStore';

/**
 * Root mobx store, containing several child stores, grouped by functionality type
 * @class RootStore
 */
export default class RootStore {
  /**
   * @var UiStore ui
   */
  @observable ui = new UiStore(this);

  /**
   * @var ContentStore content
   */
  @observable content = new ContentStore(this);

  /**
   * @var CurrentCoachmarkStore currentCoachmark
   */
  @observable currentCoachmark = new CurrentCoachmarkStore(this);

  /**
   * @var CurrentStepStore currentStep
   */
  @observable currentStep = new CurrentStepStore(this);

  /**
   * Get the current coachmark, based on UI coachmarkId
   * @return {null|Object}
   */
  @computed get coachmark() {
    return this.content.coachmarks.find(c => c.id === this.ui.coachmarkId);
  }

  /**
   * Get the current step, based on UI stepId
   * @return {null|Object}
   */
  @computed get step() {
    let stepId;
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
   * @return {boolean} is the user currently creating a new coachmark
   */
  @computed get isNewCoachmark() {
    return this.ui.coachmarkId === ContentStore.NewCoachmarkId;
  }

  
  /**
   * Persist each child store
   */
  restore() {
    this.ui.restore();
    this.content.restore();
    this.currentCoachmark.restore();
    this.currentStep.restore();
  }

  /**
   * @todo Move this to UI store
   */
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
