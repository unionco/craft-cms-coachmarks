import { observable, action, computed, autorun, toJS } from 'mobx';
import Cookies from 'js-cookie';
import { handleMouseMove, handleMouseClick } from '../util/ComponentSelection';


export default class UiStore {
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
    this._open = !this._open;
  }

  @action setOpen(open) {
    this._open = open;
    if (!this._pageType) {
      this.setPageType(UiStore.PTMainMenu);
    }
    this.writeState();
  }

  @computed get open() {
    return this._open;
  }

  @observable _selectedComponent;
  @action.bound setSelectedComponent(comp) {
      this.setComponentSelectMode(false);
      console.log('setSelectedComponent', comp);
      this._selectedComponent = comp;
  }
  @computed get selectedComponent() {
      return this._selectedComponent;
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
    // console.log('pageType: ', this._pageType);
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

  /** Component select mode */
  @observable _componentSelectMode = false;

  @action.bound setComponentSelectMode(mode) {
    console.log('setComponentSelectMode:', mode);
    this._componentSelectMode = mode;
    this.writeState();
  }

  @computed get componentSelectMode() {
    console.log('get componentSelectMode: ', this._componentSelectMode);
    return this._componentSelectMode;
  }

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
  writeState() {
    Cookies.set(UiStore.CookieName, this.serialize());
  }

  restore() {
    const state = Cookies.get(UiStore.CookieName);
    this.deserialize(state);
  }

  serialize() {
    return JSON.stringify({
      _open: toJS(this._open),
      _pageType: toJS(this._pageType),
      _coachmarkId: toJS(this._coachmarkId),
      _stepId: toJS(this._stepId),
      _componentSelectMode: toJS(this._componentSelectMode),
    });
  }

  @action deserialize(json) {
    try {
      const state = JSON.parse(json);
      this._open = state._open;
      this._pageType = state._pageType;
      this._coachmarkId = state._coachmarkId;
      this._stepId = state._stepId;
      this._componentSelectMode = state._componentSelectMode;
    } catch (err) {
      this._open = false;
      this._pageType = UiStore.PTMainMenu;
      this._coachmarkId = undefined;
      this._stepId = undefined;
      this._componentSelectMode = false;
    }
  }
}
