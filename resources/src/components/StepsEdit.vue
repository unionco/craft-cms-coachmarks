<template>
  <BaseDetail>
    <template v-slot:toolbar>
      <md-toolbar class="md-accent" md-elevation="1">
        <!-- Back Button -->
        <md-button class="md-icon-button" @click="$store.ui.editCoachmark">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <!-- Title -->
        <h3 class="md-title" style="flex: 1">Edit Steps</h3>
        <!-- Cancel Button -->
        <md-button class="md-primary md-icon-button" @click="$store.ui.newStep">
          <md-icon>add</md-icon>
        </md-button>
      </md-toolbar>
    </template>

    <template v-slot:content>
      <md-list v-if="$store.content.getCoachmarkSteps($store.ui.coachmarkId).length">
        <md-list-item
          v-for="step in $store.content.getCoachmarkSteps($store.ui.coachmarkId)"
          :key="step.id"
          @click="() => $store.ui.editStep(step.id)"
        >{{ step.label }}</md-list-item>
      </md-list>
      <md-empty-state v-else md-label="No Steps"/>
    </template>

    <template v-slot:actions>
      <md-button class="md-raised" @click="$store.ui.newStep">Add a new step</md-button>
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