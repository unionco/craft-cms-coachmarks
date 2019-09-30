import { observable, action, computed, toJS } from 'mobx';
import BaseCoachmarksStore from './BaseCoachmarksStore';
import { saveStep } from '../api/Steps';
import ContentStore from './ContentStore';

export default class CurrentStepStore extends BaseCoachmarksStore {
  constructor(rootStore) {
    super();
    this.rootStore = rootStore;
  }

  /**
   * @var {Object} rootStore reference to the root store
   */
  rootStore = undefined;

  /**
   * @var {Number} _id
   */
  @observable _id = 0;

  /**
   * @var {string} _selectedNode
   */
  @observable _selectedNode = '';

  /**
   * @var {string} _label
   */
  @observable _label = '';

  /**
   * @var {string} _description
   */
  @observable _description = '';

  /**
   * @var {string} _uri
   */
  @observable _url = '';

  /**
   * @var {string} _tooltipPosition
   */
  @observable _tooltipPosition = 'right';

  /**
   * @var {string} _saveStatus
   */
  @observable _saveStatus = ContentStore.StateUninit;

  /** @inheritdoc */
  @action.bound reset() {
    this._id = 0;
    this._selectedNode = '';
    this._label = '';
    this._tooltipPosition = 'right';
  }

  /** @inheritdoc */
  cookieName() {
    return 'cm-current-step';
  }

  /**
   * Set the current step ID
   * @param {Number} id 
   */
  @action.bound setId(id) {
    this._id = id;
    this.writeState();
  }

  /**
   * Get the current step ID
   * @return {Number}
   */
  @computed get id() {
    return this._id;
  }

  /**
   * Set the selected node identifier
   * @param {string} node 
   */
  @action.bound setSelectedNode(node) {
    this._selectedNode = node;
    this.writeState();
  }

  /**
   * Get the selected node identifier
   * @return {string}
   */
  @computed get selectedNode() {
    return this._selectedNode;
  }

  /**
   * Set the label
   * @param {string} label 
   */
  @action.bound setLabel(label) {
    this._label = label;
    this.writeState();
  }

  /**
   * @return {string}
   */
  @computed get label() {
    return this._label;
  }

  /**
   * Set the description
   * @param {string} desc 
   */
  @action.bound setDescription(desc) {
    this._description = desc;
    this.writeState();
  }

  /**
   * @return {string}
   */
  @computed get description() {
    return this._description;
  }

  /**
   * Set the tooltip position string
   * @param {string} pos 
   */
  @action.bound setTooltipPosition(pos) {
    this._tooltipPosition = pos;
    this.writeState();
  }

  /**
   * @return {string}
   */
  @computed get tooltipPosition() {
    return this._tooltipPosition;
  }

  /**
   * Set all parameters based on a given object
   * @param {Object} data 
   */
  @action.bound configure(data) {
    this._label = data.label;
    this._description = data.description;
    this._url = data.url;
    this._selectedNode = data.selectedNode;
    this._tooltipPosition = data.tooltipPosition;
    this.writeState();
  }

  /**
   * Save the current step against a given coachmark ID (parent)
   * @param {Number} coachmarkId 
   * @return {Object}
   */
  @action.bound async save(coachmarkId) {
    const result = await saveStep({
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
