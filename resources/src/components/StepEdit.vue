<template>
  <BaseDetail>
    <template v-slot:toolbar>
      <md-toolbar class="md-accent" md-elevation="1">
        <md-button @click="$store.ui.editSteps">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <h3 class="md-title" style="flex: 1">Edit Step</h3>
        <md-button class="md-primary">
          <md-icon>cancel</md-icon>
        </md-button>
      </md-toolbar>
    </template>

    <template v-slot:content>
      <form novalidate class="md-layout" @submit.prevent="validate">
        <div class="md-layout md-gutter">
          <Field label="Step Label" :class="getValidationClass('label')">
            <md-input v-model="form.label" :disabled="loading" />
            <span class="md-error" v-if="!$v.form.label.required">Label is required</span>
            <span class="md-error" v-if="!$v.form.label.minLength">Label min length is 5</span>
          </Field>
          <Field label="Step Description (Optional)" :class="getValidationClass('description')">
            <md-input v-model="form.description" :disabled="loading" />
          </Field>
          <Field label="Tooltip Position">
            <md-select
              v-model="form.tooltipPosition"
              @md-selected="$store.currentStep.setTooltipPosition"
            >
              <md-option value="top">Top</md-option>
              <md-option value="right">Right</md-option>
              <md-option value="bottom">Bottom</md-option>
              <md-option value="left">Left</md-option>
            </md-select>
          </Field>
          <Field label="Node Selector">
            <md-input disabled v-model="form.selectedNode" />
            <md-button
              @click="() => componentSelectMode = !componentSelectMode"
            >{{ componentSelectMode ? 'Cancel' : 'Select' }}</md-button>
            <span class="md-error" v-if="!$v.form.selectedNode.required">Node Selector is required</span>
          </Field>

          <Field label="Step Order" :field-class="getValidationClass('order')">
            <md-input v-model="form.order" type="number" />
            <span class="md-error" v-if="!$v.form.order.required">Order! is required</span>
            <span class="md-error" v-if="!$v.form.order.minValue">Order must be a positive integer</span>
          </Field>

          <Field>
            <md-button type="submit" class="md-primary md-raised" :disabled="loading">Save</md-button>
          </Field>
        </div>
      </form>
    </template>
    <template v-slot:activity>
      <Activity :loading="loading" />
    </template>
    <template v-slot:actions></template>
    <template v-slot:snackbar>
      <md-snackbar :md-active.sync="success">Step saved</md-snackbar>
      <md-snackbar :md-active.sync="error">Error</md-snackbar>
    </template>
  </BaseDetail>
</template>
  </BaseDetail>
</template>

<script>
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import BaseDetail from './BaseDetail';
import {
  //   addCompomnentSelectedListener,
  //   removeComponentSelectListener,
  handleMouseMove,
  handleMouseClick,
  sanitizeSelector,
} from '../util/ComponentSelection';
import { required, minLength, minValue } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import Activity from './Activity.vue';
import Field from './forms/Field.vue';

@Observer
@Component({
  components: {
    BaseDetail,
    Activity,
    Field,
  },
  mixins: [validationMixin],
  validations: {
    form: {
      label: {
        required,
        minLength: minLength(5),
      },
      description: {},
      selectedNode: {
        required,
      },
      order: {
        required,
        minValue: minValue(0),
      },
    },
  },
})
export default class StepEdit extends Vue {
  form = {
    label: this.$store.currentStep.label,
    description: this.$store.currentStep.description,
    selectedNode: this.$store.currentStep.selectedNode,
    tooltipPosition: this.$store.currentStep.tooltipPosition,
    order: this.$store.currentStep.order,
  };

  loading = false;
  success = false;
  error = false;
  componentSelectMode = false;

  @Watch('componentSelectMode')
  onComponentSelectModeChange(val, oldVal) {
    console.log('onComponentSelectModeChanged', val);
    setTimeout(() => {
      if (val === true) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', this.setSelectedComponent);
      } else {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('click', this.setSelectedComponent);
      }
    }, 100);
  }

  setSelectedComponent(e) {
    e.preventDefault();
    const selector = e.target.getSelector();
    this.form.selectedNode = sanitizeSelector(selector);
    console.log(this.form.nodeSelector);
    this.componentSelectMode = false;
  }

  componentSelectListenerCallback(e) {
    this.componentSelectMode = false;
    this.nodeSelector = e.detail.selector;
  }

  async save() {
    this.success = false;
    this.error = false;
    this.loading = true;
    this.$store.currentStep.setTooltipPosition(this.form.tooltipPosition);
    this.$store.currentStep.setLabel(this.form.label);
    this.$store.currentStep.setDescription(this.form.description);
    this.$store.currentStep.setSelectedNode(this.form.selectedNode);
    const result = await this.$store.currentStep.save(
      this.$store.ui.coachmarkId
    );
    this.loading = false;
    if (result.success && result.id) {
      this.success = true;
      setTimeout(() => {
        this.$store.ui.editSteps();
      }, 500);
    } else {
      this.error = true;
    }
  }

  validate() {
    console.log('validate');
    this.$v.$touch();
    if (!this.$v.$invalid) {
      this.save();
    } else {
      console.error(this.$v);
    }
  }

  /**
   * Return class 'md-invalid' if the field validation fails
   */
  getValidationClass(fieldName) {
    const field = this.$v.form[fieldName];

    if (field) {
      return field.$invalid && field.$dirty ? 'md-invalid' : '';
    }
  }
}
</script>

<style>
#selector-top,
#selector-bottom {
  background: blue;
  height: 3px;
  position: fixed;
  transition: all 300ms ease;
}
#selector-left,
#selector-right {
  background: blue;
  width: 3px;
  position: fixed;
  transition: all 300ms ease;
}

.n {
  -webkit-transform: scale(3) translateX(100px);
}
</style>