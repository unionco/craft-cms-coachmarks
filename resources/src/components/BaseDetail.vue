<template>
  <div md-elevation="6" class="Detail">
    <md-card>
      <!-- <md-card-header> -->
        <div class="toolbar">
          <slot name="toolbar"></slot>
        </div>
      <!-- </md-card-header> -->
      <md-card-content>
        <div class="content">
          <slot name="content"></slot>
        </div>
      </md-card-content>
      <md-card-actions>
        <slot name="actions"></slot>
      </md-card-actions>
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
    text-align: center;
  }
}
</style>