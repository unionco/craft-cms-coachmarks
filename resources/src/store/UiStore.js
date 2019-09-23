import { observable, action, computed, autorun, toJS } from 'mobx';
import BaseCoachmarksStore from './BaseCoachmarksStore';

export default class UiStore extends BaseCoachmarksStore {
  cookieName() {
    return 'cm-ui';
  }

  static CookieName = 'cm-ui';
  /** Page Types */
  static PTCoachmarkDetail = 'CoachmarkDetail';
  static PTMainMenu = 'MainMenu';
  static PTCoachmarkEdit = 'CoachmarkEdit';
  static PTStepsEdit = 'StepsEdit';
  static PTStepEdit = 'StepEdit';
  static PTCoachmarkPlay = 'CoachmarkPlay';

  /** Open */
  @observable _open = false;
  @observable _stepActive = false;
  @observable _pageType = UiStore.PTMainMenu;
  @observable _coachmarkId = undefined;
  @observable _stepId = undefined;
  @observable _rect = '';
  @observable _stepBoxPosition = '';
  @observable _tooltipPosition = '';
  /** Steps for the current coachmark */
  @observable _steps = [];

  @action.bound toggleOpen() {
    this.setOpen(!this.open);
  }

  @action.bound reset() {
    this._open = false;
    this._pageType = UiStore.PTMainMenu;
    this._coachmarkId = 0;
  }

  @computed get stepActive() {
    return this._stepActive;
  }

  @action setOpen(open) {
    console.log('setOpen', open);
    this._open = open;
    if (!this._pageType) {
      this.setPageType(UiStore.PTMainMenu);
    }
    this.writeState();
  }

  @computed get open() {
    return this._open;
  }

  @action.bound setPageType(pt) {
    this._pageType = pt;
    this.writeState();
  }

  @computed get pageType() {
    return this._pageType;
  }

  @action.bound setCoachmarkId(id) {
    this._coachmarkId = id;
    this.writeState();
  }

  @computed get coachmarkId() {
    return this._coachmarkId;
  }

  @action.bound setStepId(id) {
    this._stepId = id;
    this.writeState();
  }

  @computed get stepId() {
    return this._stepId;
  }

  @computed get stepBoxPosition() {
    return this._stepBoxPosition;
  }
  @action.bound setStepBoxPosition(rect) {
    this._rect = rect;
    this._stepBoxPosition = `top: ${rect.top}px; left: ${rect.left}px; width: ${rect.width}px; height: ${rect.height}px`;
  }

  @computed get tooltipPosition() {
    return this._tooltipPosition;
  }
  @action.bound setTooltipPosition(orientation) {
    console.log('orientation', orientation);
    switch (orientation) {
      case 'bottom':
        this._tooltipPosition = 'top: 100%; left: 0px;';
        break;
      case 'top':
        this._tooltipPosition =
          'top: 0px; left: 0px; transform: translateY(-100%); margin-top: 0px; margin-bottom: 10px;';
        break;
      case 'left':
        this._tooltipPosition = `top: ${this._rect.top}px; left: ${this._rect.left}px;`;
        break;
      case 'right':
        this._tooltipPosition =
          'top: 0px; left: 100%; margin-top: 0px; margin-left: 10px;';
        break;
    }
  }

  @action.bound setSteps(stepIds) {
    this._steps = stepIds;
    this.writeState();
  }
  @computed get steps() {
    return this._steps;
  }

  @computed get currentStepIndex() {
      const currentIndex = this._steps.indexOf(this.stepId);
      return currentIndex > -1 ? currentIndex : false;
  }

  @computed get numberOfSteps() {
      return this._steps.length;
  }

  @computed get stepProgress() {
      if (this.numberOfSteps) {
        return 100*(this.currentStepIndex + 1)/(this.numberOfSteps);
      } else {
          return 0;
      }

  }

  @computed get previousStepIndex() {
    const currentStepIndex = this._steps.indexOf(this.stepId);
    const previousIndex = currentStepIndex > 0 ? currentStepIndex - 1 : false;
    return previousIndex;
  }

  @computed get nextStepIndex() {
    const currentStepIndex = this._steps.indexOf(this.stepId);
    const nextIndex =
      currentStepIndex < (this._steps.length - 1) ? currentStepIndex + 1 : false;
    return nextIndex;
  }

  @action.bound goToNextStep() {
    const nextStepIndex = this.nextStepIndex;
    const nextStep = this._steps[nextStepIndex] || false;
    if (nextStep) {
      this.setStepId(nextStep);
    }
    return nextStep;
  }

  @action.bound goToPreviousStep() {
    const previousStepIndex = this.previousStepIndex;
    const previousStep = this._steps[previousStepIndex] || false;
    if (previousStep) {
      this.setStepId(previousStep);
    }
    return previousStep;
  }
}
