<template>
  <BaseDetail>
    <template v-slot:toolbar>
      <div v-if="coachmark">
        <md-toolbar class="md-accent" md-elevation="1">
          <md-button @click="$store.goToMainMenu">
            <md-icon>arrow_back</md-icon>
          </md-button>
          <h3 class="md-title" style="flex: 1">{{ coachmark.name }}</h3>
          <md-button class="md-primary" @click="() => $store.editCoachmark(coachmark.id)">
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
          <md-steppers md-vertical @update:mdActiveStep="handleChange">
            <md-step
              v-for="step in coachmark.steps"
              :key="step.id"
              :id="`step-${step.id.toString()}`"
              :md-label="step.label"
              :md-description="step.description"
              
            >{{ step.description }}</md-step>
          </md-steppers>
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

const newCoachmarkId = -1;

@Observer
@Component({
  components: {
    BaseDetail,
  },
})
export default class CoachmarkDetail extends Vue {
  id = 0;
  coachmark = {};

  mounted() {
    this.id = this.$store.ui.coachmarkId;
  }

  @Watch('id')
  onIdChange(val, oldVal) {
    console.log('id changed', val, oldVal);
    this.coachmark = this.$store.getCoachmark(val);
  }

    handleChange(e) {
        console.log(e);
    }

//   @Inject() goToMainMenu;
//   @Inject() getCoachmark;
//   @Inject() editCoachmark;
//   @Inject() goToStep;
}
</script>

<style scoped>
.steps {
  min-height: 200px;
}
</style>
