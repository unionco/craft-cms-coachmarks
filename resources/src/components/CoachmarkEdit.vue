
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
            <label>Title</label>
            <md-input v-bind:value="title" @change="e => $store.currentCoachmark.setTitle(e.target.value)"/>
          </md-field>
          <md-field>
            <label>Readonly Users</label>
            <md-select multiple v-model="readOnlyUsers">
              <md-option
                v-for="user in availableReadonlyUsers"
                :value="user.id"
                :key="user.id"
              >{{ user.username }}</md-option>
            </md-select>
          </md-field>
          <md-field>
            <label>Read/Write Users</label>
            <md-select multiple v-model="readWriteUsers">
              <md-option
                v-for="user in availableReadWriteUsers"
                :value="user.id"
                :key="user.id"
              >{{ user.username }}</md-option>
            </md-select>
          </md-field>
        </div>
      </form>
    </template>

    <template v-slot:actions>
      <md-button v-if="$store.currentCoachmark.id > 0" @click="$store.editSteps">Edit Steps</md-button>
      <md-button type="submit" class="md-primary" :disabled="sending" @click="save">Save</md-button>
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
  title = '';
  readOnlyUsers = [];
  availableReadonlyUsers = [];
  readWriteUsers = [];
  availableReadWriteUsers = [];
  sending = false;


  /**
   * If a user is added to read only users, he cannot also be added to read/write
   */
  @Watch('readOnlyUsers')
  onReadonlyUsersChange(val, oldVal) {
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
  onReadWriteUsersChange(val, oldVal) {
    val.forEach(userId => {
      this.availableReadonlyUsers = this.availableReadonlyUsers.filter(
        availableUser => availableUser.id !== userId
      );
    });
    this.$store.currentCoachmark.setReadWriteUsers(val);
  }

  created() {
    this.title = this.$store.currentCoachmark.title;
    this.readOnlyUsers =
      this.$store.currentCoachmark.readOnlyUsers || [];
    this.readWriteUsers =
      this.$store.currentCoachmark.readWriteUsers || [];
    
    const users = this.$store.content.users;
    // console.log(users);
    this.availableReadonlyUsers = users.filter(
      user => !this.readWriteUsers.includes(user.id)
    );
    this.availableReadWriteUsers = users.filter(
      user => !this.readOnlyUsers.includes(user.id)
    );
  }

  validate() {
    console.log('validate');
  }

  save() {
    this.$store.currentCoachmark.save();
  }
}
</script>