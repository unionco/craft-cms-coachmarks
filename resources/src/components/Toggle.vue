<template>
  <div class="Toggle">
    <md-button class="md-fab" @click="$store.ui.toggleOpen">
      <md-icon v-if="!$store.ui.open">add_comment</md-icon>
      <md-icon v-else>close</md-icon>
    </md-button>
  </div>
</template>

<script>
import { Observer } from 'mobx-vue';
import { Vue, Component } from 'vue-property-decorator';

@Observer
@Component
export default class Toggle extends Vue {}
</script>

<style scoped>
.Toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99;
}
</style>
