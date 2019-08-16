import { observable, action, computed, toJS } from 'mobx';
import Cookies from 'js-cookie';

export default class UiStore {
  static CookieName = 'cm-ui';
  /** Page Types */
  static PTCoachmarkDetail = 'CoachmarkDetail';
  static PTMainMenu = 'MainMenu';
  static PTCoachmarkEdit = 'CoachmarkEdit';

  /** Open */
  @observable _open = false;

  @action.bound toggleOpen() {
    this._open = !this._open;
    console.log('open: ', this._open);
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

  /** Page Type */
  @observable _pageType = UiStore.PTMainMenu;

  @action.bound setPageType(pt) {
    this._pageType = pt;
    this.writeState();
  }

  @computed get pageType() {
    console.log('pageType: ', this._pageType);
    return this._pageType;
  }

  /** Coachmark ID */
  @observable _coachmarkId = undefined;

  @action.bound setCoachmarkId(id) {
    this._coachmarkId = id;
    this.writeState();
  }

  @computed get coachmarkId() {
    return this._coachmarkId;
  }

  /** Step ID */
  @observable _stepId = undefined;

  @action.bound setStepId(id) {
    this._stepId = id;
    this.writeState();
  }

  @computed get stepId() {
    return this._stepId;
  }

  /** Edit coachmark mode */
  @observable _editCoachmarkMode = false;

  @action.bound setEditCoachmarkMode(mode) {
    this._editCoachmarkMode = mode;
    this.writeState();
  }

  @computed get editCoachmarkMode() {
    return this._editCoachmarkMode;
  }

  @observable componentSelectMode = false;

  @action.bound enableComponentSelectMode() {
    this.componentSelectMode = true;
  }

  @action.bound disableComponentSelectMode() {
    this.componentSelectMode = false;
  }

  /** Persistance */
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
      componentSelectMode: toJS(this.componentSelectMode),
      _editCoachmarkMode: toJS(this._editCoachmarkMode),
    });
  }

  @action deserialize(json) {
    try {
      const state = JSON.parse(json);
      this._open = state._open;
      this._pageType = state._pageType;
      this._coachmarkId = state._coachmarkId;
      this._stepId = state._stepId;
      this.componentSelectMode = state.componentSelectMode;
      this._editCoachmarkMode = state._editCoachmarkMode;
    } catch (err) {
      this._open = false;
      this._pageType = UiStore.PTMainMenu;
      this._coachmarkId = undefined;
      this._stepId = undefined;
      this.componentSelectMode = false;
      this._editCoachmarkMode = false;
    }
  }
}
