<template>
  <v-container>
    <v-col>
      <h1>Really Bad Rules</h1>
      <p></p>

      <h2>Community Guidelines</h2>
      <p>
        We are a familial community where if issues do arise we work through them on a case-by-case basis.
      </p>

      <ol>
        <li>
          <strong>No toxic behaviors</strong>. We are a gaming community and as such prioritize having fun above all
          else. Toxic behaviors pollute the environment of the guild and impedes the ability of users having fun.
          Elitism and
        </li>
        <li>
          <strong>Respect personal boundaries</strong>. As a gaming community we are not a politically-correct safe
          space. Thus, not every personality is going to mesh well with our community. Users are expected to act like
          adults and respect the boundaries of others when these boundaries are made apparent.
        </li>
        <li>
          <strong>Avoid excessively profane language</strong>. Insensitive language is more than common within our
          community, however, we have zero tolerance for language used to intentionally put someone down.
        </li>
        <li>
          <strong>No Spam</strong>. Nobody likes spam so let's keep the server clean. Duplicated messages, ads, and
          pinging users repeatedly is not tolerated. We extend our communiy to the internet to join us in gaming, not
          for other communities to recruit us to theirs.
        </li>
      </ol>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  transition(to, from) {
    if (from) {
      if (from.name === 'about-addons') {
        return 'slide-left'
      } else if (from.name === 'about-ranks') {
        return 'slide-right'
      }
    }

    return 'slide-left'
  },
})
export default class AboutRules extends Vue {
  title = 'Really Bad Rules'
}
</script>
