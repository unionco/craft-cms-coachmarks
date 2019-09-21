<template>
  <BaseDetail>
    <template v-slot:toolbar>
      <md-toolbar class="md-accent" md-elevation="1">
        <md-button @click="$store.editSteps">
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
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('label')">
              <label>Label</label>
              <md-input v-model="form.label" :disabled="loading"/>
              <span class="md-error" v-if="!$v.form.label.required">Label is required</span>
              <span class="md-error" v-if="!$v.form.label.minLength">Label min length is 5</span>
            </md-field>
          </div>
          <md-field>
            <label>Tooltip Position</label>
            <md-select
              v-model="form.tooltipPosition"
              @md-selected="$store.currentStep.setTooltipPosition"
            >
              <md-option value="top">Top</md-option>
              <md-option value="right">Right</md-option>
              <md-option value="bottom">Bottom</md-option>
              <md-option value="left">Left</md-option>
            </md-select>
          </md-field>
          <md-field>
            <label>Node Selector</label>
            <md-input disabled v-model="form.nodeSelector" />
            <md-button
              @click="() => componentSelectMode = !componentSelectMode"
            >{{ componentSelectMode ? 'Cancel' : 'Select' }}</md-button>
          </md-field>
          <md-button class="md-primary" @click="save">Save</md-button>
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
} from '../util/ComponentSelection';
import { required, minLength } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import Activity from './Activity.vue';

@Observer
@Component({
  components: {
    BaseDetail,
    Activity,
  },
  mixins: [validationMixin],
  validations: {
    form: {
      label: {
        required,
        minLength: minLength(5),
      },
    },
  },
})
export default class StepEdit extends Vue {
  form = {
    label: this.$store.currentStep.label,
    nodeSelector: this.$store.currentStep.nodeSelector,
    tooltipPosition: this.$store.currentStep.tooltipPosition,
  };

  loading = false;
  success = false;
  error = false;
  componentSelectMode = false;

  created() {
    // this.componentSelectMode = this.$store.ui.componentSelectMode;
    this.form.tooltipPosition = this.$store.currentStep.tooltipPosition;
    this.form.nodeSelector = this.$store.currentStep.selectedNode;
    this.form.label = this.$store.currentStep.label;
  }

  @Watch('componentSelectMode')
  onComponentSelectModeChange(val, oldVal) {
    console.log('onComponentSelectModeChanged', val);
    setTimeout(() => {
      if (val === true) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', this.setSelectedComponent);
        //   this.$store.ui.setComponentSelectMode(val);

        //   addCompomnentSelectedListener(this.componentSelectListenerCallback);
      } else {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('click', this.setSelectedComponent);

        //   removeComponentSelectListener(this.componentSelectListenerCallback);
      }
    }, 100);
  }

  setSelectedComponent(e) {
    e.preventDefault();
    console.log(e.target.getSelector());
    this.form.nodeSelector = e.target.getSelector();
    // this.form.selectedNode = e.target.getSelector();
    // this.$store.currentStep.setSelectedNode(e.target.getSelector());
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
    this.$store.currentStep.setSelectedNode(this.form.nodeSelector);
    const result = await this.$store.currentStep.save(
      this.$store.ui.coachmarkId
    );
    this.loading = false;
    if (result.success && result.id) {
      this.success = true;
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

  getValidationClass(fieldName) {
    const field = this.$v.form[fieldName];

    if (field) {
      return {
        'md-invalid': field.$invalid && field.$dirty,
      };
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