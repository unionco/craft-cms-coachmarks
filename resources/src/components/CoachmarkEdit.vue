
<template>
  <BaseDetail>
    <template v-slot:toolbar>
      <md-toolbar class="md-accent" md-elevation="1">
        <md-button @click="$store.goToMainMenu">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <h3
          class="md-title"
          style="flex: 1"
        >{{ $store.isNewCoachmark ? 'New Coachmark' : 'Edit Coachmark' }}</h3>
        <md-button class="md-primary">
          <md-icon>cancel</md-icon>
        </md-button>
      </md-toolbar>
    </template>

    <template v-slot:content>
      <form novalidate class="md-layout" @submit.prevent="validate">
        <md-card class="md-layout-item">
          <md-card-content>
            <div class="md-layout md-gutter">
              <md-field>
                <label>Name</label>
                <md-input v-model="$store.content.currentCoachmark.name" />
              </md-field>
            </div>
          </md-card-content>
        </md-card>
      </form>
    </template>
  </BaseDetail>
</template>

<script>
import { Vue, Component, Inject } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import BaseDetail from './BaseDetail.vue';

@Observer
@Component({
  components: {
      BaseDetail,
  }
})
export default class CoachmarkEdit extends Vue {
//   @Inject() goToMainMenu;
}
</script>