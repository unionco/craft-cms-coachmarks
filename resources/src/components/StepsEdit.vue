<template>
  <BaseDetail>
    <template v-slot:toolbar>
      <md-toolbar class="md-accent" md-elevation="1">
        <!-- Back Button -->
        <md-button class="md-icon-button" @click="$store.editCoachmark">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <!-- Title -->
        <h3 class="md-title" style="flex: 1">Edit Steps</h3>
        <!-- Cancel Button -->
        <md-button class="md-primary md-icon-button">
          <md-icon>cancel</md-icon>
        </md-button>
      </md-toolbar>
    </template>

    <template v-slot:content>
      <md-list>
        <md-list-item
          v-for="step in $store.stepsForCoachmark"
          :key="step.id"
          @click="() => $store.editStep(step.id)"
        >{{ step.label }}</md-list-item>
      </md-list>
    </template>

    <template v-slot:actions>
      <md-button class="md-raised" @click="$store.newStep">Add a new step</md-button>
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