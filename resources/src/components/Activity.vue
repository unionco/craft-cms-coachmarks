<template>
  <div>
    <slot v-if="!$props.loading"></slot>
    <md-progress-bar v-if="$props.loading" md-mode="indeterminate"></md-progress-bar>
    </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';

@Observer
@Component({
  name: 'save-button',
  props: {
    loading: Boolean,
  },
})
export default class Activity extends Vue {}
</script>
