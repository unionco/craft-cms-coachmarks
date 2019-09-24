import { observable, action, computed, autorun, toJS } from 'mobx';
import BaseCoachmarksStore from './BaseCoachmarksStore';
import ContentStore from './ContentStore';

export default class UiStore extends BaseCoachmarksStore {
  constructor(rootStore) {
    super();
    this.rootStore = rootStore;
  }
  cookieName() {
    return 'cm-ui';
  }

  rootStore = undefined;

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
  @observable _showDebugcard = true;

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

  @action.bound setStepActive(active) {
    this._stepActive = active;
    this.writeState();
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
      return (100 * (this.currentStepIndex + 1)) / this.numberOfSteps;
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
      currentStepIndex < this._steps.length - 1 ? currentStepIndex + 1 : false;
    return nextIndex;
  }

  @action.bound exitPlayMode() {
    this.setPageType(UiStore.PTMainMenu);
    this.setStepActive(false);
  }

  @action.bound goToNextStep() {
    const nextStepIndex = this.nextStepIndex;
    const nextStep = this._steps[nextStepIndex] || false;
    if (nextStep) {
      this.setStepId(nextStep);
      this.checkPageUri();
      this.updateStepBoxParams();
    } else {
      console.warn('next step is false');
    }

    return nextStep;
  }

  @action.bound goToPreviousStep() {
    const previousStepIndex = this.previousStepIndex;
    const previousStep = this._steps[previousStepIndex] || false;
    if (previousStep) {
      this.setStepId(previousStep);
      this.checkPageUri();
      this.updateStepBoxParams();
    } else {
      console.warn('previous step is false');
    }
    return previousStep;
  }

  @action.bound updateStepBoxParams() {
    this.checkPageUri();
    console.log('after checkPageUri');
    const selector = this.rootStore.content.getStep(this.stepId).selectedNode;
    console.log(selector);
    const element = document.querySelector(selector);
    if (!element) {
      console.error('step target element does not exist');
      return;
    }
    const rect = element.getBoundingClientRect();
    this.setStepBoxPosition(rect);
    console.log(element);

    this.setStepActive(true);
    if (this.stepActive) {
      document.body.classList.add('u-coachmarks');
    } else {
      document.body.classList.remove('u-coachmarks');
    }
    this.setTooltipPosition(this.rootStore.step.tooltipPosition);
  }

  @action.bound startCoachmark(id = false) {
    if (!id || id instanceof Event) {
      id = this.coachmarkId;
    }
    this.setCoachmarkId(id);
    this.setPageType(UiStore.PTCoachmarkPlay);
    // if (!this.stepId) {
    const steps = this.rootStore.content.getCoachmarkSteps(id);
    if (!steps) {
      console.warn('steps is undefined');
      return;
    }
    const stepIds = steps.map(step => step.id);
    this.setSteps(stepIds);
    this.setStepId(stepIds[0]);
    // }
    // Activate play
    this.setStepActive(true);
    this.checkPageUri();
  }

  @computed get showDebugCard() {
    return this._showDebugcard;
  }

  @action.bound setShowDebugCard(val) {
    this._showDebugcard = val;
  }

  /** Navigation */
  @action.bound goToMainMenu() {
    this.setPageType(UiStore.PTMainMenu);
    this.setCoachmarkId(null);
    this.setStepId(null);
  }

  @action.bound goToCoachmark(id = false) {
    if (!id || id instanceof Event) {
      id = this.coachmarkId;
    }
    this.setCoachmarkId(id);
    this.setPageType(UiStore.PTCoachmarkDetail);
  }

  /**
   * Navigate to the Edit Coachmark view
   * @param {Number|Event|null} id
   */
  @action.bound editCoachmark(id = false) {
    // console.log('editCoachmark', id);
    if (!id || id instanceof Event) {
      id = this.coachmarkId;
    }
    this.setCoachmarkId(id);
    this.setPageType(UiStore.PTCoachmarkEdit);
    const coachmark = this.rootStore.content.coachmarks.find(c => c.id === id);
    if (!coachmark) {
      console.error('Could not find coachmark with ID: ', id);
      return;
    }
    this.rootStore.currentCoachmark.setCurrentCoachmark({
      id,
      title: coachmark.title,
      readOnlyUsers: coachmark.readOnlyUsers,
      readWriteUsers: coachmark.readWriteUsers,
    });
  }

  @action.bound createNewCoachmark() {
    this.setCoachmarkId(ContentStore.NewCoachmarkId);
    this.setStepId(null);
    this.setPageType(UiStore.PTCoachmarkEdit);
    this.rootStore.currentCoachmark.setCurrentCoachmark({
      id: ContentStore.NewCoachmarkId,
      name: '',
      //   steps: [],
      //   createdBy: 'someUser',
      readonlyUsers: [],
      readWriteUsers: [],
    });
  }

  @action.bound editSteps() {
    this.setPageType(UiStore.PTStepsEdit);
  }

  @action.bound editStep(id) {
    this.setStepId(id);
    const step = this.rootStore.content.getStep(id);
    this.rootStore.currentStep.configure(step);
    // this.setCoachmarkId(id);
    this.setPageType(UiStore.PTStepEdit);
  }

  @action.bound newStep() {
    this.setPageType(UiStore.PTStepEdit);
    this.rootStore.currentStep.configure({
      id: ContentStore.NewCoachmarkId,
      coachmarkId: this.coachmarkId,
      label: '',
      nodeSelector: '',
      tooltipPosition: 'bottom',
      order: 1,
    });
  }

  checkPageUri() {
    const current = window.location.pathname;
    const stepUri = this.rootStore.content.step.url;
    if (current !== stepUri) {
      console.log('mismatch', current, stepUri);
      window.location = stepUri;
    } else {
      console.log('correct url');
    }
  }
}
