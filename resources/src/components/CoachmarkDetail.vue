<template>
  <BaseDetail>
    <template v-slot:toolbar>
      <div v-if="coachmark">
        <md-toolbar class="md-accent" md-elevation="1">
          <!-- Back Button  -->
          <md-button class="md-icon-button" @click="$store.goToMainMenu">
            <md-icon>arrow_back</md-icon>
          </md-button>
          <!-- Title -->
          <h3 class="md-title" style="flex: 1">{{ coachmark.title }}</h3>
          <!-- Edit Button -->
          <md-button
            v-if="$store.coachmarkEditable"
            class="md-primary md-icon-button"
            @click="() => $store.editCoachmark(coachmark.id)"
          >
            <md-icon>edit</md-icon>
          </md-button>
        </md-toolbar>
      </div>
      <div v-else>
        <md-toolbar class="md-accent" md-elevation="1">
          <md-button @click="$store.goToMainMenu">
            <md-icon>arrow_back</md-icon>
          </md-button>
        </md-toolbar>
      </div>
    </template>

    <template v-slot:content>
      <div>
        <div v-if="coachmark" class="steps">
          <!-- <md-button
            v-if="$store.step.id !== $store.ui.stepId"
            class="md-raised"
            @click="() => $store.ui.setStepId($store.step.id)"
          >Start Coachmarks</md-button> -->
          <md-button
            class="md-raised"
            @click="toggleStepActive"
          >{{stepActive ? 'Disable' : 'Enable' }} Step</md-button>

          <md-steppers
            v-if="coachmark.steps !== undefined && coachmark.steps.length"
            :md-active-step="$store.ui.stepId.toString()"
            md-vertical
          >
            <md-step
              v-for="step in coachmark.steps"
              :key="step.id"
              :id="step.id.toString()"
              :md-label="step.label"
              :md-editable="false"
              @click="() => stepId = step.id"
            />
          </md-steppers>
          <md-empty-state
            v-else
            md-icon="list"
            md-label="Create your first step"
            md-description="Steps guide your client through the CMS"
          ></md-empty-state>
        </div>

        <div v-else>
          DEBUG:
          <br />coachmark is not defined.
          <br />
          ID: {{ $store.ui.coachmarkId }}
          <br />Coachmarks:
          <br />
          <ul>
            <li v-for="c in $store.content.coachmarks" :key="c.id">{{ c.id}}</li>
          </ul>
        </div>
      </div>
    </template>
  </BaseDetail>
</template>

<script>
import { Observer } from 'mobx-vue';
import { Vue, Component, Watch, Inject } from 'vue-property-decorator';
import BaseDetail from './BaseDetail.vue';
import { toJS } from 'mobx';

@Observer
@Component({
  components: {
    BaseDetail,
  },
})
export default class CoachmarkDetail extends Vue {
  id = 0;
  coachmark = {};
  stepActive = false;
  stepId = 0;
    stepDetails = {};

  mounted() {
    this.id = this.$store.ui.coachmarkId;
    this.stepActive = this.$store.ui.stepActive;
    this.stepId = this.$store.step.id;
    this.stepDetails = this.$store.step;
    console.log(toJS(this.stepDetails));
  }

  @Watch('id')
  onIdChange(val, oldVal) {
    this.coachmark = this.$store.coachmark;
  }

  @Watch('stepId')
  onStepActiveChange(val) {
      this.$store.ui.setStepId = val;
      this.stepDetails = this.$store.step;
      console.log(this.stepDetails);
  }

  toggleStepActive() {
      this.stepActive = !this.stepActive;
      const selector = this.stepDetails.selectorNode;
      const element = document.querySelector(selector);
      console.log(element);
  }

  @Watch('stepActive')
  onStepActiveChange(val) {
      this.$store.ui._stepActive = val;
  }

}
</script>

<style scoped>
.steps {
  min-height: 200px;
}
</style>
