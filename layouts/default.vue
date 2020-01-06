<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" disable-resize-watcher app>
      <v-list>
        <v-list-item v-for="(item, i) in links" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar fixed elevate-on-scroll hide-on-scroll app>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer" />

      <v-toolbar-title id="page-title" v-text="title" />

      <v-spacer />

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn v-for="(item, i) in links" :key="i" :to="item.to" nuxt exact text>{{ item.title }}</v-btn>

        <template v-if="isAuthenticated && user">
          <v-menu offset-y dark transition="slide-y-transition">
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                <v-avatar>
                  <img
                    :src="user.avatar ? user.avatar : 'https://render-us.worldofwarcraft.com/shadow/avatar/10-1.jpg'"
                    height="48"
                    width="48"
                  />
                </v-avatar>
              </v-btn>
            </template>

            <v-list>
              <v-list-item to="/dashboard">
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>

              <v-divider />

              <v-list-item @click="$auth.logout()">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <v-btn v-else text @click="$auth.login()">Login</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content class="pa-0">
      <nuxt />
    </v-content>

    <Footer />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { User } from '../store/auth'
import Footer from '@/components/Footer.vue'
import { authStore } from '@/store'

export interface Link {
  icon?: string
  title: string
  to: string
  lower?: string
  submenu?: Link[]
}

@Component({
  components: {
    Footer
  }
})
export default class DefaultLayout extends Vue {
  drawer = false
  title = 'Really Bad Players'
  shortTitle = 'RBP'
  links: Link[] = [
    { icon: 'mdi-home', title: 'Home', to: '/' },
    {
      icon: 'mdi-bubble-chart',
      title: 'About',
      lower: 'about',
      to: '/about',
      submenu: [
        { title: 'Ranks', to: '/about/ranks' },
        { title: 'Loot Distribution', to: '/about/loot' },
        { title: 'Required Addons', to: '/about/addons' }
      ]
    },
    { icon: 'mdi-apps', title: 'Apply', to: '/apply' },
    { icon: 'mdi-bubble-chart', title: 'Roster', to: '/roster' }
  ]

  get submenu(): Link[] | undefined {
    if (!this.$route.name) {
      return undefined
    }

    const path = this.$route.name.split('-')[0]
    const link = this.links.find(l => l.lower === path)

    return link && link.submenu ? link.submenu : undefined
  }

  get isAuthenticated(): boolean {
    return authStore.loggedIn
  }

  get user(): User | undefined {
    return authStore.usr
  }

  login(): void {
    window.location.href = 'http://localhost:3000/auth/blizzard/login'
  }
}
</script>
