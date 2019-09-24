import { observable, action, computed, toJS } from 'mobx';
import BaseCoachmarksStore from './BaseCoachmarksStore';
import { newStep } from '../api/Steps';
import ContentStore from './ContentStore';

export default class CurrentStepStore extends BaseCoachmarksStore {
  constructor(rootStore) {
    super();
    this.rootStore = rootStore;
  }
  rootStore = undefined;
  @observable _id = 0;
  @observable _selectedNode = '';
  @observable _label = '';
  @observable _description = '';
  @observable _url = '';
  @observable _tooltipPosition = 'right';

  @observable _saveStatus;

  @action.bound reset() {
    this._id = 0;
    this._selectedNode = '';
    this._label = '';
    this._tooltipPosition = 'right';
  }

  cookieName() {
    return 'cm-current-step';
  }

  @action.bound setId(id) {
    this._id = id;
  }

  @computed get id() {
    return this._id;
  }

  @action.bound setSelectedNode(node) {
    this._selectedNode = node;
    this.writeState();
  }

  @computed get selectedNode() {
    return this._selectedNode;
  }

  @action.bound setLabel(label) {
    this._label = label;
    this.writeState();
  }

  @computed get label() {
    return this._label;
  }

  @action.bound setDescription(desc) {
    this._description = desc;
  }

  @computed get description() {
    return this._description;
  }

  @action.bound setTooltipPosition(pos) {
    this._tooltipPosition = pos;
    this.writeState();
  }

  @computed get tooltipPosition() {
    return this._tooltipPosition;
  }

  @action.bound configure(data) {
    this._label = data.label;
    this._description = data.description;
    this._url = data.url;
    this._selectedNode = data.selectedNode;
    this._tooltipPosition = data.tooltipPosition;
    this.writeState();
  }

  @action.bound async save(coachmarkId) {
    const result = await newStep({
      coachmarkId,
      id: toJS(this.id),
      selectedNode: toJS(this.selectedNode),
      label: toJS(this.label),
      description: toJS(this.description),
      tooltipPosition: toJS(this.tooltipPosition),
    });

    if (result.success && result.id) {
      this._saveStatus = ContentStore.StateComplete;
      this.setId(result.id);
      this.rootStore.content.fetchCoachmarks(true);
    } else {
      this._saveStatus = ContentStore.StateError;
    }
    return result;
  }
}
