
<template>
  <BaseDetail>
    <template v-slot:toolbar>
      <md-toolbar class="md-accent" md-elevation="1">
        <md-button @click="$store.goToMainMenu">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <h3
          class="md-title"
          style="flex: 1"
        >{{ $store.isNewCoachmark ? 'New Coachmark' : 'Edit Coachmark' }}</h3>
        <md-button class="md-primary">
          <md-icon>cancel</md-icon>
        </md-button>
      </md-toolbar>
    </template>

    <template v-slot:content>
      <form novalidate class="md-layout" @submit.prevent="validate">
        <div class="md-layout md-gutter">
          <md-field>
            <label>Name</label>
            <md-input v-model="name" />
          </md-field>
          <md-field>
            <label>Readonly Users</label>
            <md-select multiple v-model="readonlyUsers">
              <md-option
                v-for="user in availableReadonlyUsers"
                :value="user.id"
                :key="user.id"
              >{{ user.name }}</md-option>
            </md-select>
          </md-field>
          <md-field>
            <label>Read/Write Users</label>
            <md-select multiple v-model="readWriteUsers">
              <md-option
                v-for="user in availableReadWriteUsers"
                :value="user.id"
                :key="user.id"
              >{{ user.name }}</md-option>
            </md-select>
          </md-field>
        </div>
      </form>
    </template>

    <template v-slot:actions>
      <md-button type="submit" class="md-primary" :disabled="sending">Save</md-button>
    </template>
  </BaseDetail>
</template>

<script>
import { Vue, Component, Inject, Watch } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import BaseDetail from './BaseDetail.vue';

@Observer
@Component({
  components: {
    BaseDetail,
  },
})
export default class CoachmarkEdit extends Vue {
  name = '';
  readonlyUsers = [];
  availableReadonlyUsers = [];
  readWriteUsers = [];
  availableReadWriteUsers = [];
  sending = false;

  /**
   * If a user is added to read only users, he cannot also be added to read/write
   */
  @Watch('readonlyUsers')
  onReadonlyUsersChange(val, oldVal) {
    val.forEach(userId => {
      this.availableReadWriteUsers = this.availableReadWriteUsers.filter(
        availableUser => availableUser.id !== userId
      );
    });
  }

  /**
   * If a user is added to read/write users, he cannot also be added to read only
   */
  @Watch('readWriteUsers')
  onReadWriteUsersChange(val, oldVal) {
    val.forEach(userId => {
      this.availableReadonlyUsers = this.availableReadonlyUsers.filter(
        availableUser => availableUser.id !== userId
      );
    });
  }

  created() {
    this.name = this.$store.content.currentCoachmark.name;
    this.readonlyUsers =
      this.$store.content.currentCoachmark.readonlyUsers || [];
    this.readWriteUsers =
      this.$store.content.currentCoachmark.readWriteUsers || [];
    const users = this.$store.content.users;
    this.availableReadonlyUsers = users.filter(
      user => !this.readWriteUsers.includes(user.id)
    );
    this.availableReadWriteUsers = users.filter(
      user => !this.readonlyUsers.includes(user.id)
    );
  }

  validate() {
    console.log('validate');
  }
}
</script>