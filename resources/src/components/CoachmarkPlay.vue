<template>
  <div class="PlayActions">
    <div>
      <md-progress-bar md-mode="determinate" :md-value="$store.ui.stepProgress" />
    </div>
    <div class="row">
      <md-button class="md-icon-button" @click="$store.goToCoachmark">
        <md-icon>cancel</md-icon>
      </md-button>
      <md-button
        class="md-icon-button"
        @click="$store.ui.goToPreviousStep"
        :disabled="$store.ui.previousStepIndex === false"
      >
        <md-icon>keyboard_arrow_left</md-icon>
      </md-button>
      <md-button
        class="md-icon-button"
        @click="$store.ui.goToNextStep"
        :disabled="$store.ui.nextStepIndex === false"
      >
        <md-icon>keyboard_arrow_right</md-icon>
      </md-button>
      <span class="md-title">
        <span v-html="$store.ui.currentStepIndex+1"></span>
        <span>/</span>
        <span v-html="$store.ui.numberOfSteps"></span>
      </span>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';

@Observer
@Component
export default class CoachmarkPlay extends Vue {}
</script>

<style lang="scss" scoped>
.PlayActions {
  //   width: 20px;
  display: flex;
  flex-direction: column;

  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>
