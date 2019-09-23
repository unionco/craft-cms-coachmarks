<template>
  <div class="md-theme-default">
    <div class="Coachmarks">
      <Toggle />
      <div class="Coachmarks-main">
        <div v-if="!$store.content.loaded">
          <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>
        <div v-else class="page">
          <component
            v-if="$store.ui.open"
            v-bind:is="$store.ui.pageType"
            :class="{isOpen: $store.ui.open, 'md-elevation-6': true}"
          />
        </div>
      </div>
    </div>
    <StepBox v-if="$store.ui.stepActive" 
    :position="$store.ui.stepBoxPosition"
    :tooltip-position="$store.content.step.tooltipPosition"
    :label="$store.content.step.label"
    />
    <DebugCard/>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import Toggle from './Toggle.vue';
import MainMenu from './MainMenu.vue';
import CoachmarkDetail from './CoachmarkDetail.vue';
import ContentStore from '../store/ContentStore';
import CoachmarkEdit from './CoachmarkEdit.vue';
import StepsEdit from './StepsEdit.vue';
import StepEdit from './StepEdit.vue';
import '../scss/global.scss';
import StepBox from './StepBox.vue';
import DebugCard from './debug/DebugCard.vue';
import CoachmarkPlay from './CoachmarkPlay.vue';

@Observer
@Component({
  name: 'coachmarks',
  props: {},
  components: {
    Toggle,
    MainMenu,
    CoachmarkDetail,
    CoachmarkEdit,
    StepsEdit,
    StepEdit,
    StepBox,
    CoachmarkPlay,
    DebugCard,
  },
})
export default class Coachmarks extends Vue {
  created() {
    // Restore state from cookies
    this.$store.restore();
  }
  mounted() {
    // console.log('coachmarksState:', this.$store.content.coachmarksState);
    if (this.$store.content.coachmarksState !== ContentStore.StateComplete) {
      this.$store.content.fetchCoachmarks();
    }
    // console.log('usersState:', this.$store.content.usersState);
    if (this.$store.content.usersState !== ContentStore.StateComplete) {
      this.$store.content.fetchUsers();
    }
  }
}
</script>

<style lang="scss" scoped>
.Coachmarks-main {
  z-index: 10;
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 376px;
  min-height: 250px;
  max-height: 750px;
  height: calc(100% - 120px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  pointer-events: none;

  .isOpen {
    pointer-events: all;
  }

  .content-container {
    display: flex;
    flex-direction: column;
  }
  .page {
    z-index: 0;
    background-color: white;
  }
}
</style>