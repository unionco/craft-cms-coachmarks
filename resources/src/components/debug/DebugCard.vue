<template>
  <md-card class="DebugCard">
    <md-card-content>
      <div v-for="store in Object.keys(display)" :key="store">
        <p class="md-title">{{store}}</p>
        <md-table>
          <md-table-row>
            <md-table-head>key</md-table-head>
            <md-table-head>value</md-table-head>
          </md-table-row>
          <md-table-row v-for="attr in display[store]" :key="attr">
            <md-table-cell>{{attr}}</md-table-cell>
            <md-table-cell><pre>{{(typeof $store[store][attr] == 'object') ? JSON.stringify($store[store][attr], null, 2) : $store[store][attr]}}</pre></md-table-cell>
          </md-table-row>
        </md-table>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import { toJS } from 'mobx';

@Observer
@Component()
export default class DebugCard extends Vue {
  display = {
    ui: [
      'coachmarkId',
      'stepId',
      'pageType',
      'steps',
      'previousStepIndex',
      'currentStepIndex',
      'nextStepIndex',
      'stepActive',
      'stepBoxPosition',
      'tooltipPosition',
    ],
    currentCoachmark: ['id'],
    currentStep: ['id'],
    content: ['step', 'coachmark', 'coachmarks', 'users'],
  };
}
</script>

<style lang="scss" scoped>
.DebugCard {
  z-index: 100;
  position: fixed;
  bottom: 10px;
  left: 20px;
  max-width: 300px;
  max-height: 600px;
  overflow: scroll;
}
</style>
