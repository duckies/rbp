<template>
  <v-footer color="#0f1011">
    <!-- <v-container class="footer-push"> -->
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 class="footer-top">
          <div class="footer-grid">
            <div class="footer-grid-block footer-grid-block--padded">
              <div class="footer-img">
                <v-img
                  src="https://s3.amazonaws.com/files.enjin.com/632721/material/images/logo_medium.png"
                  max-height="172"
                  max-width="220"
                />
              </div>
            </div>
            <div class="footer-grid-block footer-grid-block--padded">
              <v-list class="transparent-list" dense nav>
                <v-list-item v-for="link in navItems" :key="link.title" :to="link.link">
                  <v-list-item-content>
                    <v-list-item-title v-text="link.title" />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
            <div class="footer-grid-block footer-grid-block--padded" />
            <div class="footer-grid-block footer-grid-block--padded" />
            <div class="footer-grid-block">
              <discord />
            </div>
          </div>
        </v-flex>
        <v-flex xs12 class="footer-bottom">
          <div class="footer-bottom--left">
            <span class="copyright-info">
              Really Bad Players | All Rights Reserved
            </span>
          </div>
          <div class="footer-bottom--right">
            <span>
              Created by
              <a href="https://worldofwarcraft.com/en-us/character/blackrock/duckie" target="blank">
                Duckie
              </a>
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
    },
    {
      title: 'Logs',
      link: 'https://www.warcraftlogs.com/guild/id/5825'
    }
  ]
}
</script>

<style lang="scss" scoped>
.transparent-list {
  background-color: transparent !important;
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
