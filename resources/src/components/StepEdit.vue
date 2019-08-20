<template>
  <BaseDetail>
    <template v-slot:toolbar>
      <md-toolbar class="md-accent" md-elevation="1">
        <md-button @click="$store.editSteps">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <h3 class="md-title" style="flex: 1">Edit Step</h3>
        <md-button class="md-primary">
          <md-icon>cancel</md-icon>
        </md-button>
      </md-toolbar>
    </template>

    <template v-slot:content>
      <form novalidate class="md-layout" @submit.prevent="validate">
        <div class="md-layout md-gutter">
          <md-field>
            <label>Label</label>
            <md-input v-model="label" @change="e => $store.currentStep.setLabel(e.target.value)" />
          </md-field>
          <md-field>
            <label>Tooltip Position</label>
            <md-select
              v-model="tooltipPosition"
              @md-selected="$store.currentStep.setTooltipPosition"
            >
              <md-option value="top">Top</md-option>
              <md-option value="right">Right</md-option>
              <md-option value="bottom">Bottom</md-option>
              <md-option value="left">Left</md-option>
            </md-select>
          </md-field>
          <md-field>
            <label>Node Selector</label>
            <md-input disabled v-model="nodeSelector" />
            <md-button
              @click="() => componentSelectMode = !componentSelectMode"
            >{{ componentSelectMode ? 'Cancel' : 'Select' }}</md-button>
          </md-field>
        </div>
      </form>
    </template>

    <template v-slot:actions>
      <md-button class="md-primary" @click="save">Save</md-button>
    </template>
  </BaseDetail>
</template>
  </BaseDetail>
</template>

<script>
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import BaseDetail from './BaseDetail';
import {
  //   addCompomnentSelectedListener,
  //   removeComponentSelectListener,
  handleMouseMove,
  handleMouseClick,
} from '../util/ComponentSelection';

@Observer
@Component({
  components: {
    BaseDetail,
  },
})
export default class StepEdit extends Vue {
  label = '';
  nodeSelector = '';
  tooltipPosition = 'top';
  componentSelectMode = false;

  created() {
    // this.componentSelectMode = this.$store.ui.componentSelectMode;
    this.tooltipPosition = this.$store.currentStep.tooltipPosition;
    this.nodeSelector = this.$store.currentStep.selectedNode;
    this.label = this.$store.currentStep.label;
  }

  @Watch('componentSelectMode')
  onComponentSelectModeChange(val, oldVal) {
    console.log('onComponentSelectModeChanged', val);
    setTimeout(() => {
      if (val === true) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', this.setSelectedComponent);
        //   this.$store.ui.setComponentSelectMode(val);

        //   addCompomnentSelectedListener(this.componentSelectListenerCallback);
      } else {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('click', this.setSelectedComponent);

        //   removeComponentSelectListener(this.componentSelectListenerCallback);
      }
    }, 100);
  }

  setSelectedComponent(e) {
    e.preventDefault();
    console.log(e.target.getSelector());
    this.nodeSelector = e.target.getSelector();
    this.$store.currentStep.setSelectedNode(e.target.getSelector());
    this.componentSelectMode = false;
  }

  componentSelectListenerCallback(e) {
    this.componentSelectMode = false;
    this.nodeSelector = e.detail.selector;
  }

  save() {
      this.$store.currentStep.save(this.$store.ui.coachmarkId);
  }
}
</script>

<style>
#selector-top,
#selector-bottom {
  background: blue;
  height: 3px;
  position: fixed;
  transition: all 300ms ease;
}
#selector-left,
#selector-right {
  background: blue;
  width: 3px;
  position: fixed;
  transition: all 300ms ease;
}

.n {
  -webkit-transform: scale(3) translateX(100px);
}
</style>