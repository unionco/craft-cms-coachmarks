<template>
  <div md-elevation="6'">
    <div v-if="coachmark">
      <md-toolbar class="md-accent" md-elevation="1">
        <md-button @click="goToMainMenu">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <h3 class="md-title" style="flex: 1">{{ coachmark.name }}</h3>
        <md-button class="md-primary" @click="() => editCoachmark(coachmark.id)">
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
    <div v-else>
      <md-toolbar class="md-accent" md-elevation="1">
        <md-button @click="goToMainMenu">
          <md-icon>arrow_back</md-icon>
        </md-button>
      </md-toolbar>
      <p>
        DEBUG:<br/>
        coachmark is not defined. <br/>
        ID: {{ $cmUiStore.coachmarkId }} <br/>
        Coachmarks:<br/>
        <ul>
          <li v-for="c in $cmContentStore.coachmarks" :key="c.id">
            {{ c.id}}
          </li>
        </ul>
      </p>
    </div>
  </div>
</template>

<script>
import { Observer } from 'mobx-vue';
import { Vue, Component, Watch, Inject } from 'vue-property-decorator';

const newCoachmarkId = -1;

@Observer
@Component
export default class CoachmarkDetail extends Vue {
  id = 0;
  coachmark = {};

    mounted() {
        this.id = this.$cmUiStore.coachmarkId;
    }

    @Watch('id')
    onIdChange(val, oldVal) {
        console.log('id changed', val, oldVal);
        this.coachmark = this.getCoachmark(val);
    }

  @Inject() goToMainMenu;
  @Inject() getCoachmark;
  @Inject() editCoachmark;
}
</script>

<style scoped>
.steps {
  min-height: 200px;
}
</style>
