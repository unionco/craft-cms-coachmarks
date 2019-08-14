<template>
  <div class="Coachmarks-main" v-if="$cmUiStore.open">
    <MainMenu v-if="$cmUiStore.pageType === 'mainMenu'" />
    <CoachmarkDetail v-else-if="$cmUiStore.pageType === 'coachmarkDetail'" />
    <div v-else>Unknown route: {{ $cmUiStore.pageType }}</div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import MainMenu from './MainMenu';
import CoachmarkDetail from './CoachmarkDetail.vue';
@Observer
@Component({
  components: {
    MainMenu,
    CoachmarkDetail,
  },
})
export default class Router extends Vue {}
</script>

<style lang="scss" scoped>
.Coachmarks-main {
  z-index: 99;
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 376px;
  min-height: 250px;
  max-height: 750px;
  height: calc(100% - 120px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .content-container {
    display: flex;
    flex-direction: column;
  }
}
</style>