<template>
  <BaseDetail>
    <template v-slot:toolbar>
      <md-toolbar class="md-accent" md-elevation="1">
        <!-- Back Button -->
        <md-button class="md-icon-button" @click="$store.ui.goToMainMenu">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <!-- Title -->
        <h3
          class="md-title"
          style="flex: 1"
        >{{ $store.isNewCoachmark ? 'New Coachmark' : 'Edit Coachmark' }}</h3>
        <!-- Cancel Button -->
        <md-button class="md-icon-button" @click="$store.currentCoachmark.reset">
          <md-icon>cancel</md-icon>
        </md-button>
      </md-toolbar>
    </template>

    <template v-slot:content>
      <form novalidate class="md-layout" @submit.prevent="validate">
        <div class="md-gutter md-layout">
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('title')">
              <label>Title</label>
              <md-input v-model="form.title" :disabled="loading" />
              <span class="md-error" v-if="!$v.form.title.required">Title is required</span>
              <span class="md-error" v-if="!$v.form.title.minLength">Title min length is 5</span>
            </md-field>
          </div>
          <md-field>
            <label>Readonly Users</label>
            <md-select multiple v-model="form.readOnlyUsers">
              <md-option
                v-for="user in availableReadonlyUsers"
                :value="user.id"
                :key="user.id"
              >{{ user.username }}</md-option>
            </md-select>
          </md-field>
          <md-field>
            <label>Read/Write Users</label>
            <md-select multiple v-model="form.readWriteUsers">
              <md-option
                v-for="user in availableReadWriteUsers"
                :value="user.id"
                :key="user.id"
              >{{ user.username }}</md-option>
            </md-select>
          </md-field>
          <md-button type="submit" class="md-primary md-raised" :disabled="loading">Save</md-button>
        </div>
      </form>
    </template>

    <template v-slot:actions>
      <md-button
        v-if="$store.currentCoachmark.id > 0"
        class="md-secondary md-raised"
        @click="$store.ui.editSteps"
      >Edit Steps</md-button>
    </template>
    <template v-slot:activity>
      <Activity :loading="loading" />
    </template>
    <template v-slot:snackbar>
      <md-snackbar :md-active.sync="success">Coachmark saved</md-snackbar>
    </template>
  </BaseDetail>
</template>

<script>
// v-bind:value="form.title"
// @change="e => $store.currentCoachmark.setTitle(e.target.value)" -->
import { Vue, Component, Inject, Watch } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import BaseDetail from './BaseDetail.vue';
import ContentStore from '../store/ContentStore';
import Activity from './Activity.vue';
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
@Observer
@Component({
  components: {
    BaseDetail,
    Activity,
  },
  mixins: [validationMixin],
  validations: {
    form: {
      title: {
        required,
        minLength: minLength(5),
      },
    },
  },
})
export default class CoachmarkEdit extends Vue {
  form = {
    title: '',
    readOnlyUsers: [],
    readWriteUsers: [],
  };
  availableReadonlyUsers = [];
  availableReadWriteUsers = [];
  sending = false;

  loading = false;
  success = false;
  error = false;
  stateLoading = ContentStore.StateLoading;
  stateComplete = ContentStore.StateComplete;

  /**
   * If a user is added to read only users, he cannot also be added to read/write
   */
  @Watch('readOnlyUsers')
  onReadonlyUsersChange(val) {
    this.resetSaveStatus();
    val.forEach(userId => {
      this.availableReadWriteUsers = this.availableReadWriteUsers.filter(
        availableUser => availableUser.id !== userId
      );
    });
    this.$store.currentCoachmark.setReadOnlyUsers(val);
  }

  /**
   * If a user is added to read/write users, he cannot also be added to read only
   */
  @Watch('readWriteUsers')
  onReadWriteUsersChange(val) {
    this.resetSaveStatus();
    val.forEach(userId => {
      this.availableReadonlyUsers = this.availableReadonlyUsers.filter(
        availableUser => availableUser.id !== userId
      );
    });
    this.$store.currentCoachmark.setReadWriteUsers(val);
  }

  created() {
    this.form.title = this.$store.currentCoachmark.title;
    this.form.readOnlyUsers = this.$store.currentCoachmark.readOnlyUsers || [];
    this.form.readWriteUsers =
      this.$store.currentCoachmark.readWriteUsers || [];

    const users = this.$store.content.users;
    // console.log(users);
    this.availableReadonlyUsers = users.filter(
      user => !this.form.readWriteUsers.includes(user.id)
    );
    this.availableReadWriteUsers = users.filter(
      user => !this.form.readOnlyUsers.includes(user.id)
    );
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

  async save() {
    this.success = false;
    this.error = false;
    this.loading = true;
    const result = await this.$store.currentCoachmark.save();
    this.loading = false;
    if (result.success && result.id) {
      this.success = true;
    } else {
      this.error = true;
    }
  }

  resetSaveStatus() {
    this.$store.currentCoachmark.setSaveStatus(ContentStore.StateUninit);
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