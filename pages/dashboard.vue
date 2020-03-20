<template>
  <div>
    <hero :background="background" :title="title" :caption="caption" />

    <v-container class="hero-nudge" style="margin-bottom: 500px">
      <v-row>
        <v-col cols="6" sm="6">
          <v-card>
            <v-card-title>Account Information</v-card-title>
            <v-card-text>
              <v-row>
                <v-col>BattleTag</v-col>
                <v-col><span v-text="user.battletag"/></v-col>
              </v-row>
              <v-row>
                <v-col>Display Name</v-col>
                <v-col><span v-text="user.displayName"/></v-col>
              </v-row>
              <v-row>
                <v-col>Role</v-col>
                <v-col>
                  <span v-for="(role, i) in user.roles" :key="i" v-text="role" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" sm="6"></v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { User } from '../store/user'
import Hero from '@/components/Hero.vue'
import { userStore } from '@/store'

@Component({
  components: {
    Hero
  }
})
export default class Dashboard extends Vue {
  title = 'Really Bad Dashboard'
  caption = 'Settings and other fun things'
  background = 'https://cdnassets.raider.io/images/login/backgrounds/bfa/nazjatar2.jpg'

  get user(): User | null {
    return userStore.user
  }
}
</script>
