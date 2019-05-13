<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar fixed app>
      <v-container fill-height py-0>
        <v-app-bar-nav-icon
          class="hidden-md-and-up"
          @click="drawer = !drawer"
        />

        <v-toolbar-title v-text="title" />

        <v-spacer />

        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn v-for="item in items" :key="item.title" :to="item.to" text>{{
            item.title
          }}</v-btn>
        </v-toolbar-items>
      </v-container>
    </v-app-bar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class DefaultLayout extends Vue {
  drawer = false
  title = 'Really Bad Players'
  items = [
    { icon: 'apps', title: 'Home', to: '/' },
    { icon: 'bubble_chart', title: 'About', to: '/about' },
    { icon: 'blank', title: 'apply', to: '/apply' }
  ]
}
</script>
