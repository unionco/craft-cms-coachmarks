import BaseCoachmarksStore from './BaseCoachmarksStore';
import { observable, action, computed, set } from 'mobx';

export default class CurrentStepStore extends BaseCoachmarksStore {
    @observable _selectedNode = '';
    @observable _label = '';
    @observable _tooltipPosition;

    cookieName() {
        return 'cm-current-step';
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

    @action.bound setTooltipPosition(pos) {
        this._tooltipPosition = pos;
        this.writeState();
    }

    @computed get tooltipPosition() {
        return this._tooltipPosition;
    }

    @action.bound set(data) {
        this._label = data.label;
        this._selectedNode = data.selectedNode;
        this._tooltipPosition = data.tooltipPosition;
        this.writeState();
    }
}
