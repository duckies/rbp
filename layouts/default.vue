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

      <v-toolbar-title class="toolbar-title">
        <router-link to="/" class="toolbar-title__text">
          <skull-logo />
          Really Bad Players</router-link
        >
      </v-toolbar-title>

      <span class="sub-title">Alpha</span>

      <v-spacer />

      <v-toolbar-items class="hidden-sm-and-down">
        <template v-for="(link, i) in links">
          <v-menu v-if="link.submenu" :key="i" offset-y dark transition="slide-y-transition" bottom left>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                {{ link.title }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(sublink, j) in link.submenu"
                :key="j"
                :to="sublink.to"
                :href="sublink.href"
                nuxt
                exact
              >
                <v-list-item-title>{{ sublink.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn v-else :key="i" :to="link.to" :href="link.href" :target="link.target" nuxt exact text>
            {{ link.title }}
          </v-btn>
        </template>

        <v-btn text small href="https://discord.gg/mbwbzAs" target="_blank">
          <discord-logo />
        </v-btn>

        <template v-if="isAuthenticated && user">
          <v-menu offset-y dark transition="slide-y-transition" bottom left>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                <v-avatar>
                  <img
                    :src="avatar ? avatar : 'https://render-us.worldofwarcraft.com/shadow/avatar/10-1.jpg'"
                    height="48"
                    width="48"
                  />
                </v-avatar>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="$auth.logout()">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
              <!-- This could be explored later -->
              <!-- <v-list-item @click="$vuetify.theme.dark = !$vuetify.theme.dark">
                <v-list-item-title>
                  <v-icon>mdi-theme-light-dark</v-icon>
                </v-list-item-title>
              </v-list-item> -->
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
import SkullLogo from '@/components/svg/SkullLogo.vue'
import DiscordLogo from '@/components/svg/discord.vue'
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
    SkullLogo,
    DiscordLogo,
    Footer
  }
})
export default class DefaultLayout extends Vue {
  drawer = false
  title = 'Really Bad Players'
  shortTitle = 'RBP'
  links = [
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
    {
      icon: 'mdi-apps',
      title: 'Apply',
      to: '/apply',
      submenu: [
        { title: 'Apply Now', to: '/apply' },
        { title: 'Applications', to: '/applications' }
      ]
    },
    { icon: 'mdi-bubble-chart', title: 'Roster', to: '/roster' },
    { icon: 'mdi-sword', title: 'Logs', href: 'https://www.warcraftlogs.com/guild/calendar/500023/', target: '_blank' }
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

  get user(): User | null {
    return authStore.user
  }

  get avatar(): string | undefined {
    if (!authStore.avatars) return undefined

    if (authStore.avatars.gif) {
      return authStore.avatars.gif
    } else {
      return authStore.avatars.png
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar-title {
  color: inherit;
  padding-left: 0 !important;
  // margin-top: 5px;
  text-transform: uppercase;

  &__text {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 40px;
    font-weight: 900;
    font-family: Khand, sans-serif;
    text-decoration: inherit;
  }
}

.sub-title {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.8rem;
  position: relative;
  left: 10px;
  bottom: 8px;
}
</style>
