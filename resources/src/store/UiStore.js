import { observable, action, computed, autorun, toJS } from 'mobx';
import BaseCoachmarksStore from './BaseCoachmarksStore';
import ContentStore from './ContentStore';
import RootStore from '.';

export default class UiStore extends BaseCoachmarksStore {
  constructor(rootStore) {
    super();
    this.rootStore = rootStore;
  }

  /** @inheritdoc */
  cookieName() {
    return 'cm-ui';
  }

  /** @var {RootStore} rootStore reference to root store */
  rootStore = undefined;

  /** Page Types */
  static PTCoachmarkDetail = 'CoachmarkDetail';
  static PTMainMenu = 'MainMenu';
  static PTCoachmarkEdit = 'CoachmarkEdit';
  static PTStepsEdit = 'StepsEdit';
  static PTStepEdit = 'StepEdit';
  static PTCoachmarkPlay = 'CoachmarkPlay';

  /**
   * @var {boolean} _open Is the coachmarks UI open
   */
  @observable _open = false;

  /**
   * @var {boolean} _stepActive Is the user in the middle of a coachmark/step playback?
   */
  @observable _stepActive = false;

  /**
   * @var {string} _pageType The current page type to render. See page type statics, above, for valid options
   */
  @observable _pageType = UiStore.PTMainMenu;

  /**
   * @var {null|Number} _coachmarkId the current coachmark ID
   */
  @observable _coachmarkId = undefined;

  /**
   * @var {null|Number} _stepId the current step ID
   */
  @observable _stepId = undefined;

  /**
   * @var {string} _rect the rectangle used for displaying the StepBox during coachmark/step playback
   */
  @observable _rect = '';

  /**
   * @var {string} _stepBoxPosition the CSS style string generated for StepBox position during coachmark/step playback
   */
  @observable _stepBoxPosition = '';

  /**
   * @var {string} _tooltipPosition the CSS style string generated for the tooltip position during coachmark/step playback
   */
  @observable _tooltipPosition = '';
  
  /**
   * @var {array} _steps array of step IDs for the current coachmark. Referenced during coachmark/step playback
   */
  @observable _steps = [];

  /**
   * @var {boolean} _showDebugCard Whether to show the debug card on the bottom left side of the screen (DEV)
   */
  @observable _showDebugCard = true;

  /** @inheritdoc */
  @action.bound reset() {
    this._open = false;
    this._pageType = UiStore.PTMainMenu;
    this._coachmarkId = 0;
  }

  /**
   * Get whether the user is in playback mode
   * @return {boolean}
   */
  @computed get stepActive() {
    return this._stepActive;
  }

  /**
   * Set the current playback mode
   * @param {boolean} active 
   */
  @action.bound setStepActive(active) {
    this._stepActive = active;
    this.writeState();
  }

    /**
   * Toggle whether the coachmarks UI is open or closed
   * @return {null}
   */
  @action.bound toggleOpen() {
    this.setOpen(!this.open);
  }

  /**
   * Set the UI open/close state
   * @param {boolean} open
   * @return {null}
   */
  @action setOpen(open) {
    console.log('setOpen', open);
    this._open = open;
    if (!this._pageType) {
      this.setPageType(UiStore.PTMainMenu);
    }
    this.writeState();
  }

  /**
   * Get the UI open/close state
   * @return {boolean}
   */
  @computed get open() {
    return this._open;
  }

  /**
   * Set the UI page type
   * @param {string} pt 
   * @return {null}
   */
  @action.bound setPageType(pt) {
    this._pageType = pt;
    this.writeState();
  }

  /**
   * Get the UI page type
   * @return {string}
   */
  @computed get pageType() {
    return this._pageType;
  }

  /**
   * Set the current coachmark ID
   * @param {null|Number} id 
   * @return {null}
   */
  @action.bound setCoachmarkId(id) {
    this._coachmarkId = id;
    this.writeState();
  }

  /**
   * Get the current coachmark ID
   * @return {null|Number}
   */
  @computed get coachmarkId() {
    return this._coachmarkId;
  }

  /**
   * Set the current step ID
   * @param {null|Number} id
   * @return {null}
   */
  @action.bound setStepId(id) {
    this._stepId = id;
    this.writeState();
  }

  /**
   * Get the current step ID
   * @return {null|Number}
   */
  @computed get stepId() {
    return this._stepId;
  }

  /**
   * Get the calculated StepBox position string
   * @return {string}
   */
  @computed get stepBoxPosition() {
    return this._stepBoxPosition;
  }

  /**
   * Set the _rect attribute and calculate the StepBox position, based on the target rect
   * @param {Object} rect
   * @return {null}
   */
  @action.bound setStepBoxPosition(rect) {
    this._rect = rect;
    this._stepBoxPosition = `top: ${rect.top}px; left: ${rect.left}px; width: ${rect.width}px; height: ${rect.height}px`;
  }

  /**
   * Get the tooltip position string
   * @return {string}
   */
  @computed get tooltipPosition() {
    return this._tooltipPosition;
  }

  /**
   * Set the tooltip position, based on orientation (left|right|top|bottom)
   * @param {string} orientation
   * @return {null}
   */
  @action.bound setTooltipPosition(orientation) {
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

  /**
   * Set step IDs available for the current coachmark
   * @param {array} stepIds 
   * @return {null}
   */
  @action.bound setSteps(stepIds) {
    this._steps = stepIds;
    this.writeState();
  }

  /**
   * Get the step IDs available for the current coachmark
   * @return {array}
   */
  @computed get steps() {
    return this._steps;
  }

  /**
   * Get the index of the current step in the array of _steps
   * @return {false|Number}
   */
  @computed get currentStepIndex() {
    const currentIndex = this._steps.indexOf(this.stepId);
    return currentIndex > -1 ? currentIndex : false;
  }

  /**
   * Get a count of the available steps
   * @return {Number}
   */
  @computed get numberOfSteps() {
    return this._steps.length;
  }

  /**
   * Get the current step playback progress, as a percentage, 0 >= x >= 100
   * @return {Number}
   */
  @computed get stepProgress() {
    if (this.numberOfSteps) {
      return (100 * (this.currentStepIndex + 1)) / this.numberOfSteps;
    }
    return 0;
  }

  /**
   * Get an index for the previous step, or false if the user is on the first step
   * @return {false|Number}
   */
  @computed get previousStepIndex() {
    const currentStepIndex = this._steps.indexOf(this.stepId);
    const previousIndex = currentStepIndex > 0 ? currentStepIndex - 1 : false;
    return previousIndex;
  }

  /**
   * Get an index for the next step, or false if the user in on the last step
   * @return {false|Number}
   */
  @computed get nextStepIndex() {
    const currentStepIndex = this._steps.indexOf(this.stepId);
    const nextIndex =
      currentStepIndex < this._steps.length - 1 ? currentStepIndex + 1 : false;
    return nextIndex;
  }

  /**
   * Set playback mode to false and send the user to the main menu
   * @return {null}
   */
  @action.bound exitPlayMode() {
    this.setPageType(UiStore.PTMainMenu);
    this.setStepActive(false);
  }

  /**
   * Advance to the next step, making sure the user is on the right page for the given step
   * @return {null}
   */
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

  /**
   * Go back to the previous step, making sure the user is on the right page for the given step
   * @return {null}
   */
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

  /**
   * Update the Stepox parameters
   * @todo Refactor based on hash
   * @return {null}
   */
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

  /**
   * Start coachmark playback. Sets the coachmark ID (or uses current coachmark ID) and
   * sets the page type, steps, etc.
   * @param {null|Number|Event} id 
   * @return {null}
   */
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

  /**
   * Get whether the debug card should be shown (DEV)
   * @return {boolean}
   */
  @computed get showDebugCard() {
    return this._showDebugCard;
  }

  /**
   * Set whether the debug card should be shown (DEV)
   * @param {boolean} val
   * @return {null}
   */
  @action.bound setShowDebugCard(val) {
    this._showDebugCard = val;
  }

  /**
   * Navigate to the main menu, resetting coachmark/step ids
   * @return {null}
   */
  @action.bound goToMainMenu() {
    this.setPageType(UiStore.PTMainMenu);
    this.setCoachmarkId(null);
    this.setStepId(null);
  }

  /**
   * Navigate to the Coachmark Detail page for the given coachmark ID.
   * If the given ID is null or a click event, use the current coachmark id
   * @param {null|Number|Event} id 
   * @return {null}
   */
  @action.bound goToCoachmark(id = false) {
    if (!id || id instanceof Event) {
      id = this.coachmarkId;
    }
    this.setCoachmarkId(id);
    this.setPageType(UiStore.PTCoachmarkDetail);
  }

  /**
   * Navigate to the Coachmark Edit page for the given coachmark ID.
   * If the given ID is null or ac lick event, use the current coachmark ID.
   * @param {Number|Event|null} id
   * @return {null}
   */
  @action.bound editCoachmark(id = false) {
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

  /**
   * Navigate to the Coachmark Edit page, setting the current coachmark to default values
   * @return {null}
   */
  @action.bound createNewCoachmark() {
    this.setCoachmarkId(ContentStore.NewCoachmarkId);
    this.setStepId(null);
    this.rootStore.currentStep.setId(null);
    this.setPageType(UiStore.PTCoachmarkEdit);
    this.rootStore.currentCoachmark.setCurrentCoachmark({
      id: ContentStore.NewCoachmarkId,
      name: '',
      readonlyUsers: [],
      readWriteUsers: [],
    });
  }

  /**
   * Navigate to the Steps Edit page
   * @return {null}
   */
  @action.bound editSteps() {
    this.setPageType(UiStore.PTStepsEdit);
  }

  /**
   * Navigate to the Step Edit page
   * @param {Number|null|Event} id 
   * @return {null}
   */
  @action.bound editStep(id) {
    this.setStepId(id);
    const step = this.rootStore.content.getStep(id);
    this.rootStore.currentStep.configure(step);
    // this.setCoachmarkId(id);
    this.setPageType(UiStore.PTStepEdit);
  }

  /**
   * Navifate to the Step Edit page, setting the current step to defaults
   * @return {null}
   */
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

  /**
   * Check the current page URI and redirect if it does not match the current step URL
   * @return {null}
   */
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
