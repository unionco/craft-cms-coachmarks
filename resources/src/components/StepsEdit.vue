<template>
  <BaseDetail>
    <template v-slot:toolbar>
      <md-toolbar class="md-accent" md-elevation="1">
        <md-button @click="$store.editCoachmark">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <h3 class="md-title" style="flex: 1">Edit Steps</h3>
        <md-button class="md-primary">
          <md-icon>cancel</md-icon>
        </md-button>
      </md-toolbar>
    </template>

    <template v-slot:content>
      <md-list>
        <md-list-item v-for="step in $store.stepsForCoachmark" :key="step.id">{{ step.label }}</md-list-item>
      </md-list>
    </template>

    <template v-slot:actions>
        <md-button md-primary @click="$store.newStep">Add a new step</md-button>
    </template>
  </BaseDetail>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import BaseDetail from './BaseDetail';

@Observer
@Component({
  components: {
    BaseDetail,
  },
})
export default class StepsEdit extends Vue {}
</script>