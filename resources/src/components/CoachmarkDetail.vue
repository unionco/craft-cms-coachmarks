<template>
  <div v-if="coachmark">
    <md-toolbar class="md-accent" md-elevation="1">
      <md-button>
        <md-icon>arrow_back</md-icon>
      </md-button>
      <h3 class="md-title" style="flex: 1">{{ coachmark.name }}</h3>
      <md-button class="md-primary">
        <md-icon>edit</md-icon>
      </md-button>
    </md-toolbar>
    <div class="steps">
      <md-steppers md-vertical>
        <md-step
          v-for="step in coachmark.steps"
          :key="step.id"
          :id="step.id.toString()"
          :md-label="step.label"
          :md-description="step.description"
        >{{ step.description }}</md-step>
      </md-steppers>
    </div>
  </div>
</template>

<script>
import { Observer } from 'mobx-vue';
import { Vue, Component } from 'vue-property-decorator';

@Observer
@Component
export default class CoachmarkDetail extends Vue {
  coachmark = undefined;
  created() {
      const id = this.$cmUiStore.coachmarkId;
    this.coachmark = this.$cmContentStore.coachmarks.find(coachmark => coachmark.id === id);
  }
}
</script>

<style scoped>
.steps {
    min-height: 200px;
}
</style>