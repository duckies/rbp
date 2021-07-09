<template>
  <div>
    <v-navigation-drawer v-model="drawer" disable-resize-watcher app>
      <template #prepend>
        <v-list-item v-if="auth.user">
          <v-list-item-avatar>
            <img :src="auth.user.avatar" />

            <v-list-item-content>
              <v-list-item-title>{{ auth.user.discord_tag }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item v-else>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn text @click="auth.login()">Login</v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider />

      <v-list nav>
        <template v-for="(item, i) in links">
          <v-list-group v-if="item.submenu" :key="i" :prepend-icon="item.icon">
            <template #activator>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="subitem in item.submenu"
              :key="subitem.title"
              nuxt
              link
              :to="subitem.to"
            >
              <v-list-item-title v-text="subitem.title" />

              <v-list-item-icon>
                <v-icon v-text="subitem.icon" />
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>

          <v-list-item
            v-else
            :key="item.title"
            :to="item.to"
            nuxt
            link
            :exact="item.to === '/'"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-title v-text="item.title" />
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar fixed elevate-on-scroll hide-on-scroll app>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer" />

      <v-toolbar-title class="toolbar-title">
        <RouterLink to="/" class="toolbar-title__text">
          <SvgSkullLogo />
          <span class="hidden-md-and-down">Really Bad Players</span>
          <span class="d-lg-none">RBP</span>
        </RouterLink>
      </v-toolbar-title>

      <v-spacer />

      <v-toolbar-items>
        <template v-for="link in links">
          <v-menu
            v-if="link.submenu"
            :key="link.title"
            offset-y
            dark
            transition="slide-y-transition"
            bottom
            left
          >
            <template #activator="{ on }">
              <v-btn text class="hidden-sm-and-down" v-on="on">
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
              >
                <v-list-item-title>{{ sublink.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn
            v-else
            :key="link.title"
            :to="link.to"
            :href="link.href"
            :target="link.target"
            class="hidden-sm-and-down"
            nuxt
            text
          >
            {{ link.title }}
          </v-btn>
        </template>

        <v-btn
          text
          small
          href="https://discord.gg/mbwbzAs"
          target="_blank"
          rel="noreferrer"
          aria-label="Discord Invite"
        >
          <SvgDiscordLogo />
        </v-btn>

        <template v-if="auth.user">
          <v-menu offset-y dark transition="slide-y-transition" bottom left>
            <template #activator="{ on }">
              <v-btn text v-on="on">
                <v-avatar>
                  <img :src="auth.user.avatar" height="48" width="48" />
                </v-avatar>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="auth.logout()">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <v-btn v-else text @click="auth.login()">Login</v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import { useAuth } from '@client/stores'
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { Link } from '@/interfaces/link.interface'

export default defineComponent({
  setup() {
    const drawer = ref(false)

    const auth = useAuth()

    return {
      auth,
      drawer,
      links: [
        { icon: 'mdi-home', title: 'Home', to: '/' },
        {
          icon: 'mdi-script-text',
          title: 'About',
          lower: 'about',
          to: '/about',
          submenu: [
            { title: 'Ranks', to: '/about/ranks' },
            { title: 'Loot Distribution', to: '/about/loot' },
            { title: 'Required Addons', to: '/about/addons' },
          ],
        },
        {
          icon: 'mdi-skull-outline',
          title: 'Apply',
          to: '/apply',
          submenu: [
            { icon: 'mdi-fountain-pen-tip', title: 'Apply Now', to: '/apply' },
            {
              icon: 'mdi-skull-crossbones-outline',
              title: 'Applications',
              to: '/applications',
            },
          ],
        },
        { icon: 'mdi-ghost', title: 'Roster', to: '/roster' },
        {
          icon: 'mdi-sword-cross',
          title: 'Logs',
          href: 'https://www.warcraftlogs.com/guild/calendar/500023/',
          target: '_blank',
          rel: 'noreferrer',
        },
      ] as Link[],
    }
  },
})
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';
@import '~vuetify/src/components/VGrid/_mixins';

.v-app-bar {
  backdrop-filter: blur(5px);
  background-color: rgba(32, 33, 36, 0.7) !important;

  .v-toolbar__content,
  .v-toolbar__extension {
    margin: 0 auto;
    @include make-container-max-widths;
  }

  &.v-app-bar--is-scrolled {
    background-color: #141517;
  }

  .v-btn__content {
    font-weight: 900;
  }
}
</style>

<style lang="scss" scoped>
.toolbar-title {
  color: inherit;
  padding-left: 0 !important;
  text-transform: uppercase;

  &__mobile {
    &__title {
      width: 100%;
    }
  }

  &__text {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 40px;
    font-weight: 900;
    font-family: Khand, sans-serif;
    text-decoration: inherit;
  }

  &__title {
    margin-top: 5px;
  }
}
</style>
