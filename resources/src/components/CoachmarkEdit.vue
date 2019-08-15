
<template>
  <div md-elevation="6">
    <div>
      <md-toolbar class="md-accent" md-elevation="1">
        <md-button @click="goToMainMenu">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <h3
          class="md-title"
          style="flex: 1"
        >{{ $cmUiStore.coachmarkId === -1 ? 'New Coachmark' : 'Edit Coachmark' }}</h3>
        <md-button class="md-primary">
          <md-icon>cancel</md-icon>
        </md-button>
      </md-toolbar>
      <form novalidate class="md-layout" @submit.prevent="validate">
        <md-card class="md-layout-item">
          <md-card-content>
            <div class="md-layout md-gutter">
              <md-field>
                <label>Name</label>
                <md-input v-model="$cmContentStore.currentCoachmark.name" />
              </md-field>
            </div>
          </md-card-content>
        </md-card>
      </form>
    </div>
  </div>
</template>

<script>
import { Vue, Component, Inject } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';

@Observer
@Component
export default class CoachmarkEdit extends Vue {
  @Inject() goToMainMenu;
}
</script>