<template>
  <div md-elevation="6" class="Detail">
      <div class="toolbar">
          <slot name="toolbar"></slot>
        </div>
    <md-card class="md-primary">
      <md-card-header>
        
      </md-card-header>
      <md-card-content>
        <div class="content">
          <slot name="content"></slot>
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import { Vue } from 'vue-property-decorator';

export default class BaseDetail extends Vue {}
</script>

<style lang="scss" scoped>
.Detail {
  background-color: white;
  .toolbar {
  }

  .content {
    min-height: 200px;
  }
}
</style>