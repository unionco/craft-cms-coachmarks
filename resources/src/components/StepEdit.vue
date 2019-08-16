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
            <md-input v-model="label" />
          </md-field>
          <md-field>
            <label>Tooltip Position</label>
            <md-select v-model="tooltipPosition">
              <md-option value="top">Top</md-option>
              <md-option value="right">Right</md-option>
              <md-option value="bottom">Bottom</md-option>
              <md-option value="left">Left</md-option>
            </md-select>
          </md-field>
          <md-field>
            <label>Node Selector</label>
            <md-input disabled v-model="nodeSelector"/>
            <md-button @click="$store.ui.enableComponentSelectMode">Select</md-button>
            
          </md-field>
        </div>
      </form>
    </template>

    <template v-slot:actions>
        <md-button class="md-primary">Save</md-button>
    </template>
  </BaseDetail>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import BaseDetail from './BaseDetail';

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

}
</script>