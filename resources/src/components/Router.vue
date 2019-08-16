<template>
  <div class="Coachmarks-main" v-if="$store.ui.open">
    <MainMenu v-if="$store.ui.pageType === 'mainMenu'" />
    <CoachmarkDetail v-else-if="$store.ui.pageType === 'coachmarkDetail'" />
    <CoachmarkEdit v-else-if="$store.ui.pageType === 'coachmarkEdit'" />
    <StepDetail v-else-if="$store.ui.pageType === 'stepDetail'" />
    <div v-else>Unknown route: {{ $store.ui.pageType }}</div>
  </div>
</template>

<script>
// <component :is="<componentName>">
import { Vue, Component, Provide, Inject } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import Cookies from 'js-cookie';
import MainMenu from './MainMenu';
import CoachmarkDetail from './CoachmarkDetail.vue';
import CoachmarkEdit from './CoachmarkEdit.vue';
import StepDetail from './StepDetail.vue';

@Observer
@Component({
  components: {
    MainMenu,
    CoachmarkDetail,
    CoachmarkEdit,
    StepDetail,
  },
})
export default class Router extends Vue {
  created() {
    const uiState = Cookies.get('cm-ui');
    console.log(JSON.parse(uiState));
    this.$store.ui.deserialize(uiState);

    const contentState = Cookies.get('cm-content');
    console.log(JSON.parse(contentState));
    this.$store.content.deserialize(contentState);
  }

  @Inject() getCoachmark;

  @Provide()
  goToCoachmark(id) {
    console.log('DEBUG: goToCoachmark(' + id + ')');
    this.$store.ui.coachmarkId = id;
    this.$store.ui.pageType = 'coachmarkDetail';
    this.writeState();
  }

  @Provide()
  editCoachmark(id) {
    this.$store.ui.coachmarkId = id;
    this.$store.content.currentCoachmark = this.getCoachmark(id);
    this.$store.ui.editCoachmarkMode = true;
    this.$store.ui.pageType = 'coachmarkEdit';
    this.writeState();
  }

  @Provide()
  createNewCoachmark() {
    this.$store.ui.coachmarkId = -1; // Use -1 for a new coachmark
    this.$store.ui.pageType = 'coachmarkEdit';
    this.$store.ui.editCoachmarkMode = true;
    this.$store.content.currentCoachmark = { id: -1 };
    this.writeState();
  }

  @Provide()
  goToStep(id) {
      this.$store.ui.stepId = id;
      this.$store.ui.pageType = 'stepDetail';
      this.writeState();
  }

  @Provide()
  goToMainMenu() {
    this.$store.ui.pageType = 'mainMenu';
    this.$store.ui.coachmarkId = undefined;
    this.$store.ui.editCoachmarkMode = false;
    this.writeState();
  }

  writeState() {
    Cookies.set('cm-ui', this.$store.ui.serialize());
    Cookies.set('cm-content', this.$store.content.serialize());
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
