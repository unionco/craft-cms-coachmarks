<template>
  <div class="MainMenu">
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
        <md-button
          @click="$store.createNewCoachmark"
          class="md-raised md-primary"
        >Create a new coachmark</md-button>
        <md-divider />
        <div class="md-headline">Your coachmarks</div>
        <md-list v-if="$store.content.coachmarks.length">
          <md-list-item
            v-for="coachmark in $store.content.coachmarks"
            :key="coachmark.id"
            @click="() => $store.goToCoachmark(coachmark.id)"
          >{{ coachmark.title }}</md-list-item>
        </md-list>
        <md-empty-state
          v-else
          md-size="120"
          class="md-primary"
          md-icon="menu"
          md-label="No Coachmarks Yet"
          md-description="Create a new Coachmark to get started"
        />
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
    text-align: center;
  }
}
</style>
