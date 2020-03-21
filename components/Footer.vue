<template>
  <v-footer color="#0f1011">
    <!-- <v-container class="footer-push"> -->
    <v-container>
      <v-layout row wrap>
        <v-row>
          <v-col cols="12" md="3">
            <v-row align="center" justify="center">
              <v-img
                src="https://s3.amazonaws.com/files.enjin.com/632721/material/images/logo_medium.png"
                max-height="172"
                max-width="220"
              />
            </v-row>
          </v-col>

          <v-col cols="6" sm="4" md="2">
            <h3 class="footer--title">Navigation</h3>
            <v-list class="transparent-list" dense nav>
              <v-list-item v-for="link in navItems" :key="link.title" :to="link.link">
                <v-list-item-content>
                  <v-list-item-title v-text="link.title" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="6" sm="4" md="2">
            <h3 class="footer--title">External Info</h3>
            <v-list class="transparent-list" dense>
              <v-list-item v-for="link in resources" :key="link.title" :href="link.link" target="_blank">
                <v-list-item-content>
                  <v-list-item-title v-text="link.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="6" sm="4" md="2">
            <h3 class="footer--title">Really Bad</h3>
            <p class="footer--text">The world's worst 2-night raiding guild on Area-52.</p>
          </v-col>

          <v-col md="3">
            <discord />
          </v-col>
        </v-row>

        <v-flex xs12 class="footer-bottom">
          <div class="footer-bottom--left">
            <span class="copyright-info">
              Really Bad Players | All Rights Reserved
            </span>
          </div>
          <div class="footer-bottom--right">
            <span>
              Created by
              <a href="https://worldofwarcraft.com/en-us/character/area-52/duckys" target="blank">
                Duckie
              </a>
              with hate.
            </span>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Discord from '@/components/Discord.vue'

@Component({
  components: {
    Discord
  }
})
export default class Footer extends Vue {
  navItems = [
    {
      title: 'Home',
      link: '/'
    },
    {
      title: 'About',
      link: '/about'
    },
    {
      title: 'Application',
      link: '/apply'
    },
    {
      title: 'Roster',
      link: '/roster'
    }
  ]

  private readonly resources = [
    {
      title: 'WarcraftLogs',
      link: 'https://www.warcraftlogs.com/guild/calendar/500023/'
    },
    {
      title: 'WoWProgress',
      link: 'https://www.wowprogress.com/guild/us/area-52/Really+Bad+Players'
    },
    {
      title: 'RaiderIO',
      link: 'https://raider.io/guilds/us/area-52/Really%20Bad%20Players'
    }
  ]
}
</script>

<style lang="scss" scoped>
.transparent-list {
  background-color: transparent !important;
}

.footer--title {
  padding: 0 10px;
}

.footer--text {
  padding: 5px 10px;
  font-family: 'Roboto Mono', sans-serif;
  font-size: 0.8em;
}

.footer-img {
  height: 100%;
  display: flex;
  justify-content: center;
}

.footer-push {
  transform: translateY(-90px);
}

.footer-bottom {
  display: grid;
  padding: 20px;
  grid-template-columns: 1fr 1fr;
  // background-color: #1e1f21;

  &--right {
    margin-left: auto;
  }
}

.footer-grid {
  display: grid;
  grid-template-rows: 250px;
  grid-template-columns: 1.7fr 1fr 1fr 1fr 1.7fr;
  // background-color: #252629;

  &-block {
    &--padded {
      padding: 20px;
    }
  }
}
</style>
