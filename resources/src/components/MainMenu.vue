<template>
  <div class="MainMenu md-elevation-6">
    <md-card class="md-primary">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Welcome to Coachmarks</div>
          <!-- <div class="md-subhead">Subtitle here</div> -->
        </md-card-header-text>
      </md-card-header>
    </md-card>
    <md-card-content>
      <div class="content">
        <md-button @click="$store.createNewCoachmark">Create a new coachmark</md-button>
        <md-divider />Your coachmarks
        <md-list>
          <md-list-item
            v-for="coachmark in $store.content.coachmarks"
            :key="coachmark.id"
            @click="() => $store.goToCoachmark(coachmark.id)"
          >{{ coachmark.title }}</md-list-item>
        </md-list>
      </div>
    </md-card-content>
  </div>
</template>

<script>
import { Component, Vue, Inject } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';

@Observer
@Component({
  name: 'main-menu',
  components: {},
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
    }
}
</style>
