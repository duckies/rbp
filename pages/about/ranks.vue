<template>
  <div class="pa-5">
    <h2>Guild Ranks & Trialing</h2>
    Our guild utilizes a typical trial and raider rank system.

    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Guild Master</v-list-item-title>
          <v-list-item-subtitle>
            Executes the guild's goals, creates guild policies, and oversees the appointment and instruction of
            officers.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Officer</v-list-item-title>
          <v-list-item-subtitle>
            A raider tasked with the organization and management of a raiding role or function, as well as taking part
            in the loot council. Officer positions include the raid leader, recruitment officer, and performance
            officer.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Raider</v-list-item-title>
          <v-list-item-subtitle>
            A raider who has demonstrated mastery of their specialization, a reliable understanding of raid mechanics,
            and sustains exceptional attendance. Raid-night repairs and use of bank materials are permitted.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Trial</v-list-item-title>
          <v-list-item-subtitle>
            A prospective raider undergoing evaluation for group compatibility, sufficient class and mechanical
            understanding, and attendance.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Fan</v-list-item-title>
          <v-list-item-subtitle>
            We allow retired raiders, friends and family to stay in our guild and partake in content not done during
            main raid.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <h3>Trialing Process</h3>
    <p>
      Trials are evaluated over an approximate three-week period in which the trial participates in boss kills. The
      duration of the trial and its methodology are at the discretion of the officers. What content the trial is brought
      to is dependent on their gear, experience, and our current progression schedule. Certain progression decisions,
      like holding a lockout to work on a progression boss, can elongate a trialing period. However, if we see the trial
      perform to our satisfaction in raids, and with no glaring problems as discussed between the officers and the
      trial, they will be promoted to Raider. Failing a trial may result in retrialing, demotion to a social rank, or
      removal from the guild.
    </p>
    <p>
      Trials are required to understand our policies and carry out the expectations we expect of all our raiders.
      Adaptation to our policies and practices is something an Officer will look at as part of the evaluation.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class AboutRanks extends Vue {
  title = 'Really Bad Ranks'
}
</script>
