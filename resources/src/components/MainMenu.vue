<template>
  <div class="MainMenu">
    <md-card class="md-primary">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Welcome to Coachmarks</div>
        </md-card-header-text>
      </md-card-header>
    </md-card>
    <md-card-content>
      <div class="content">
        <div v-if="$store.content.userCanCreateCoachmark">
            <md-button
            @click="$store.ui.createNewCoachmark"
            class="md-raised md-primary"
            >Create a new coachmark</md-button>
            <md-divider />
        </div>
        <div class="md-title">Your coachmarks</div>
        <CoachmarkList :coachmarks="$store.content.coachmarks" />
      </div>
    </md-card-content>
  </div>
</template>

<script>
import { Component, Vue, Inject } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import CoachmarkList from './CoachmarkList.vue';

@Observer
@Component({
  name: 'main-menu',
  components: {
    CoachmarkList,
  },
})
export default class MainMenu extends Vue {
  handleOpenChanged(e) {
    this.$store.ui.setOpen(e.open);
  }
}
</script>

<style lang="scss" scoped>
.md-content {
  height: 200px;
  display: inline-flex;
}

.MainMenu {
  background-color: white;
  .content {
    min-height: 200px;
    text-align: center;
  }
}
</style>
