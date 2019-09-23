<template>
  <md-list v-if="$props.coachmarks.length">
    <md-list-item v-for="coachmark in $props.coachmarks" :key="coachmark.id">
      {{ coachmark.title }}
      <div>
        <md-button class="md-icon-button" @click="() => $store.ui.editCoachmark(coachmark.id)">
            <md-icon>edit</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="() => $store.ui.startCoachmark(coachmark.id)">
            <md-icon>play_arrow</md-icon>
        </md-button>
      </div>
    </md-list-item>
  </md-list>
  <md-empty-state
    v-else
    md-size="120"
    class="md-primary"
    md-icon="menu"
    md-label="No Coachmarks Yet"
    md-description="Create a new Coachmark to get started"
  />
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';

@Component({
  props: {
    coachmarks: Array,
  },
})
export default class CoachmarkList extends Vue {}
</script>
