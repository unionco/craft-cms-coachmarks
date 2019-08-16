
<template>
  <BaseDetail>
    <template v-slot:toolbar>
      <md-toolbar class="md-accent" md-elevation="1">
        <md-button @click="() => goToCoachmark($store.ui.coachmarkId)">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <h3 class="md-title" style="flex: 1">{{ step.name }}</h3>
        <md-button class="md-primary">
          <md-icon>edit</md-icon>
        </md-button>
      </md-toolbar>
    </template>
    <template v-slot:content>
        label: {{ step.label }} <br/>
        description: {{ step.description }}
    </template>
  </BaseDetail>
</template>

<script>
import { Vue, Component, Inject, Watch } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import BaseDetail from './BaseDetail.vue';

@Observer
@Component({
  components: {
    BaseDetail,
  },
})
export default class StepDetail extends Vue {
    id = 0;
    step = {};

    mounted() {
        this.id = this.$store.ui.stepId;
    }

    @Watch('id')
    onIdChange(val, oldVal) {
        this.step = this.getStep(this.id);
    }
    
    @Inject() goToCoachmark;
    @Inject() getStep;
}
</script>