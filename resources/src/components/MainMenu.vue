<template>
  <div class="MainMenu">
    <UnionOverflowMenu :up="true" :flip-menu="true" @openChanged="handleOpenChanged">
      <template v-slot:trigger>
        <div ref="trigger">
          <AddComment32 v-if="!$cmUiStore.mainMenuOpen" class="icon" />
          <CloseFilled16 v-else class="icon" />
        </div>
      </template>
      <CvTile>
        <div class="header">Welcome to Coachmarks</div>
        <div>
          <CvButton>Create a new coachmark</CvButton>
        </div>
        <div>
          <ul>
            <li
              v-for="coachmark in $cmContentStore.coachmarks"
              :key="coachmark.id"
            >{{ coachmark.name }}</li>
          </ul>
        </div>
      </CvTile>
    </UnionOverflowMenu>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import {
  CvButton,
  CvStructuredList,
  CvStructuredListItem,
  CvStructuredListData,
  CvTile,
} from '@carbon/vue/src';

import CloseFilled16 from '@carbon/icons-vue/es/close/16';
import AddComment32 from '@carbon/icons-vue/es/add-comment/32';
import { Observer } from 'mobx-vue';
import UnionOverflowMenu from './UnionOverflowMenu.vue';

@Observer
@Component({
  name: 'main-menu',
  components: {
    CvButton,
    CvStructuredList,
    CvStructuredListItem,
    CvStructuredListData,
    CloseFilled16,
    AddComment32,
    CvTile,
    UnionOverflowMenu,
  },
})
export default class MainMenu extends Vue {
    handleOpenChanged(e) {
        this.$cmUiStore.setMainMenuOpen(e.open);
    }
}
</script>

<style lang="scss">
.icon {
  height: 36px;
}
.MainMenu {
  .menu {
    display: none;
    flex-direction: column;
    position: relative;
    top: -200px;

    &.open {
      display: flex;
    }
  }
}
</style>
