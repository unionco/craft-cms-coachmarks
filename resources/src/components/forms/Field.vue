<template>
  <div class="md-layout-item md-small-size-100">
    <md-field :class="($props.fieldClass || '')">
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
    fieldClass: String,
  },
})
export default class Field extends Vue {}
</script>
