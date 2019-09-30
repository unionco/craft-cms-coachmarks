<template>
  <div class="PlayActions">
    <div>
      <md-progress-bar md-mode="determinate" :md-value="$store.ui.stepProgress" />
    </div>
    <div class="row">
      <md-button class="md-icon-button md-raised md-dense" @click="$store.ui.exitPlayMode">
        <md-icon>close</md-icon>
      </md-button>
      <md-button
        class="md-icon-button md-raised md-dense"
        @click="$store.ui.goToPreviousStep"
        :disabled="$store.ui.previousStepIndex === false"
      >
        <md-icon>keyboard_arrow_left</md-icon>
      </md-button>
      <span class="md-body">
        <span v-html="$store.ui.currentStepIndex+1"></span>
        <span>/</span>
        <span v-html="$store.ui.numberOfSteps"></span>
      </span>
      <md-button
        class="md-icon-button md-raised md-dense"
        @click="$store.ui.goToNextStep"
        :disabled="$store.ui.nextStepIndex === false"
      >
        <md-icon>keyboard_arrow_right</md-icon>
      </md-button>
      
    </div>
  </div>
</template>

<script>
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';

@Observer
@Component
export default class CoachmarkPlay extends Vue {
    mounted() {
        // this.$store.ui.checkPageUri();
        this.$store.ui.updateStepBoxParams();
    }
}
</script>

<style lang="scss" scoped>
.PlayActions {
  //   width: 20px;
  display: flex;
  flex-direction: column;
  max-width: 200px;
  background-color: white;
  .row {
    display: flex;
    flex-direction: row;
    // justify-content: center;
    justify-content: flex-end;
    padding-right: 1rem;
    align-items: center;
    padding: 1rem;
  }
}
</style>
