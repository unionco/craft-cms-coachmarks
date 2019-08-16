<template>
  <div>
    <div class="Coachmarks">
      <Toggle />
      <div class="Coachmarks-main">
        <component v-if="$store.ui.open" v-bind:is="$store.ui.pageType" />
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue, Provide } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import Toggle from './Toggle.vue';
import MainMenu from './MainMenu.vue';
import CoachmarkDetail from './CoachmarkDetail.vue';
import ContentStore from '../store/ContentStore';
import CoachmarkEdit from './CoachmarkEdit.vue';

@Observer
@Component({
  name: 'coachmarks',
  props: {},
  components: {
    Toggle,
    MainMenu,
    CoachmarkDetail,
    CoachmarkEdit,
  },
})
export default class Coachmarks extends Vue {
  created() {
    // Restore state from cookies
    this.$store.restore();
  }
  mounted() {
    console.log('mounted');
    if (this.$store.content.coachmarksState === ContentStore.StateUninit) {
      this.$store.content.fetchCoachmarks();
    }
  }
}
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