<template>
  <div>
    <md-toolbar class="md-accent" md-elevation="1">
      <md-button><md-icon>arrow_back</md-icon></md-button>
      <h3 class="md-title" style="flex: 1">Title</h3>
      <md-button class="md-primary"><md-icon>edit</md-icon></md-button>
    </md-toolbar>
    Coachmark detail for {{ $cmUiStore.coachmarkId }}
  </div>
</template>

<script>
import { Observer } from 'mobx-vue';
import { Vue, Component } from 'vue-property-decorator';

@Observer
@Component
export default class CoachmarkDetail extends Vue {}
</script>