<template>
  <div>
    <div class="coachmark-overlay-background" :style="$store.ui.stepBoxPosition"></div>
    <div class="coachmark-overlay" :style="$store.ui.stepBoxPosition">
      <div class="coachmark-overlay-box" :style="$props.tooltipPosition">
        <div class="coachmark-overlay-step"><span v-html="$store.ui.currentStepIndex + 1"></span></div>
        <div class="coachmark-overlay-actions">
          <!-- <md-button class="md-icon-button" @click="$store.toggleStepActive">
            <md-icon>close</md-icon>
          </md-button> -->
          <!-- <md->Hello</md-tooltip> -->
          <span v-html="$props.label"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';

@Observer
@Component({
  props: {
    label: String,
    position: String,
    tooltipPosition: String,
  },
})
export default class StepBox extends Vue {
    created() {
        document.body.classList.add('u-coachmarks');
    }
    beforeDestroy() {
        document.body.classList.remove('u-coachmarks');
    }
}
</script>

<style lang="scss">
.u-coachmarks::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9;
}

.coachmarks-init-button {
  background: transparent;
  border: none;
  bottom: 100px;
  cursor: pointer;
  left: 50%;
  outline: none;
  position: absolute;
  transform: translate3d(-50%, 0, 0);
  z-index: 1000;
}

.coachmark-overlay {
  background: transparent;
  border-radius: 4px;
  box-shadow: 0 5px 30px -10px #000;
  position: absolute;
  z-index: 1000;

  &-actions {
    display: flex;
    padding-top: 10px;
    justify-content: space-between;

    button {
      appearance: none;
      background: transparent;
      border-radius: 0px;
    }

    &-group {
      padding-top: 0px;
    }
  }

  &-box {
    padding: 10px;
    position: absolute;
    width: 300px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 5px 30px -10px #000;
    top: 100%;
    left: 0;
    margin-top: 10px;
  }

  &-background {
    position: absolute;
    z-index: 10001;
    background-color: rgba(255, 255, 255, 0.25);
    border: 2px solid #da5a47;
    border-radius: 4px;
    box-shadow: 0 5px 30px -10px #000;
  }

  &-step {
    align-items: center;
    background: red;
    border-radius: 50%;
    color: white;
    display: flex;
    height: 25px;
    justify-content: center;
    right: 0;
    position: absolute;
    top: 0;
    transform: translate3d(-50%, -50%, 0);
    width: 25px;
    z-index: 10002;
  }
}
</style>