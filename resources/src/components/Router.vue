<template>
  <div class="Coachmarks-main" v-if="$cmUiStore.open">
    <MainMenu v-if="$cmUiStore.pageType === 'mainMenu'" />
    <CoachmarkDetail v-else-if="$cmUiStore.pageType === 'coachmarkDetail'" />
    <CoachmarkEdit v-else-if="$cmUiStore.pageType === 'coachmarkEdit'" />
    <div v-else>Unknown route: {{ $cmUiStore.pageType }}</div>
  </div>
</template>

<script>
import { Vue, Component, Provide, Inject } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import Cookies from 'js-cookie';
import MainMenu from './MainMenu';
import CoachmarkDetail from './CoachmarkDetail.vue';
import CoachmarkEdit from './CoachmarkEdit.vue';

@Observer
@Component({
  components: {
    MainMenu,
    CoachmarkDetail,
    CoachmarkEdit,
  },
})
export default class Router extends Vue {
  created() {
    const uiState = Cookies.get('cm-ui');
    // console.log(uiState);
    console.log(JSON.parse(uiState));
    this.$cmUiStore.deserialize(uiState);

    const contentState = Cookies.get('cm-content');
    console.log(JSON.parse(contentState));
    // console.log(contentState);
    this.$cmContentStore.deserialize(contentState);
  }

  @Inject() getCoachmark;

  @Provide()
  goToCoachmark(id) {
    console.log('DEBUG: goToCoachmark(' + id + ')');
    this.$cmUiStore.coachmarkId = id;
    this.$cmUiStore.pageType = 'coachmarkDetail';
    this.writeState();
  }

  @Provide()
  editCoachmark(id) {
    this.$cmUiStore.coachmardId = id;
    this.$cmContentStore.currentCoachmark = this.getCoachmark(id);
    this.$cmUiStore.editCoachmarkMode = true;
    this.$cmUiStore.pageType = 'coachmarkEdit';
    this.writeState();
  }

  @Provide()
  createNewCoachmark() {
    this.$cmUiStore.coachmarkId = -1; // Use -1 for a new coachmark
    this.$cmUiStore.pageType = 'coachmarkEdit';
    this.$cmUiStore.editCoachmarkMode = true;
    this.$cmContentStore.currentCoachmark = { id: -1 };
    this.writeState();
  }

  @Provide()
  goToMainMenu() {
    this.$cmUiStore.pageType = 'mainMenu';
    this.$cmUiStore.coachmarkId = undefined;
    this.$cmUiStore.editCoachmarkMode = false;
    this.writeState();
  }

  writeState() {
    Cookies.set('cm-ui', this.$cmUiStore.serialize());
    Cookies.set('cm-content', this.$cmContentStore.serialize());
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
