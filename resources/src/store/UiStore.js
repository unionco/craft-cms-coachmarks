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

  /** Open */
  @observable _open = false;

  @action.bound toggleOpen() {
    this.setOpen(!this.open);
  }

  @action.bound reset() {
    this._open = false;
    this._pageType = UiStore.PTMainMenu;
    this._coachmarkId = 0;
  }

  @observable _stepActive = false;
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

  /**
   * Page Type
   * */
  @observable _pageType = UiStore.PTMainMenu;

  @action.bound setPageType(pt) {
    this._pageType = pt;
    this.writeState();
  }

  @computed get pageType() {
    return this._pageType;
  }

  /**
   * Coachmark ID
   * */
  @observable _coachmarkId = undefined;

  @action.bound setCoachmarkId(id) {
    this._coachmarkId = id;
    this.writeState();
  }

  @computed get coachmarkId() {
    return this._coachmarkId;
  }

  /**
   * Step ID
   * */
  @observable _stepId = undefined;

  @action.bound setStepId(id) {
    this._stepId = id;
    this.writeState();
  }

  @computed get stepId() {
    return this._stepId;
  }

  @observable _rect = '';

  @observable _stepBoxPosition = '';
  @computed get stepBoxPosition() {
    return this._stepBoxPosition;
  }
  @action.bound setStepBoxPosition(rect) {
    this._rect = rect;
    this._stepBoxPosition = `top: ${rect.top}px; left: ${rect.left}px; width: ${
      rect.width
    }px; height: ${rect.height}px`;
  }

  @observable _tooltipPosition = '';
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
        this._tooltipPosition = 'top: 0px; left: 0px; transform: translateY(-100%); margin-top: 0px; margin-bottom: 10px;';
        break;
      case 'left':
        this._tooltipPosition = `top: ${this._rect.top}px; left: ${
          this._rect.left
        }px;`;
        break;
      case 'right':
        this._tooltipPosition = 'top: 0px; left: 100%; margin-top: 0px; margin-left: 10px;';
        break;
    }
  }
  /** Component select mode */
  //   @observable _componentSelectMode = false;

  //   @action.bound setComponentSelectMode(mode) {
  //     console.log('setComponentSelectMode:', mode);
  //     this._componentSelectMode = mode;
  //     this.writeState();
  //   }

  //   @computed get componentSelectMode() {
  //     console.log('get componentSelectMode: ', this._componentSelectMode);
  //     return this._componentSelectMode;
  //   }

  /** Autorun */
  /**
   * Listen for changes to ui.componentSelectMode
   */
  //   componentSelectModeDisposer = autorun(
  //     () => {

  //     },
  //     {
  //       onError(e) {
  //         console.error(e);
  //       },
  //     }
  //   );

  /**
   * Persistance
   * */
  //   writeState() {
  //     Cookies.set(UiStore.CookieName, this.serialize());
  //   }

  //   restore() {
  //     const state = Cookies.get(UiStore.CookieName);
  //     this.deserialize(state);
  //   }

  //   serialize() {
  //     return JSON.stringify({
  //       _open: toJS(this._open),
  //       _pageType: toJS(this._pageType),
  //       _coachmarkId: toJS(this._coachmarkId),
  //       _stepId: toJS(this._stepId),
  //       _componentSelectMode: toJS(this._componentSelectMode),
  //     });
  //   }

  //   @action deserialize(json) {
  //     try {
  //       const state = JSON.parse(json);
  //       this._open = state._open;
  //       this._pageType = state._pageType;
  //       this._coachmarkId = state._coachmarkId;
  //       this._stepId = state._stepId;
  //       this._componentSelectMode = state._componentSelectMode;
  //     } catch (err) {
  //       this._open = false;
  //       this._pageType = UiStore.PTMainMenu;
  //       this._coachmarkId = undefined;
  //       this._stepId = undefined;
  //       this._componentSelectMode = false;
  //     }
  //   }
}
