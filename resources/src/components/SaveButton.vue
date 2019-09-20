
<template>
  <div>
    <slot v-if="!$props.loading"></slot>
    <md-progress-spinner v-if="$props.loading" md-mode="indeterminate" :md-diameter="20" />
    <div v-if="$props.success" v-html="$props.successText" />
    <div v-if="$props.error" v-html="$props.errorText" />
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
    success: Boolean,
    successText: String,
    status: String,
  },
})
export default class Activity extends Vue {}
</script>
