<template>
  <div :class="'md-layout-item md-small-size-100' + $props.class">
    <md-field>
      <label v-if="$props.label" v-html="$props.label"></label>
      <slot></slot>
    </md-field>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';

@Component({
  props: {
    label: String,
  },
})
export default class Field extends Vue {}
</script>
