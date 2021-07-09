<template>
  <Hero :background="background" :title="title" :caption="caption">
    <v-card>
      <v-card-title>Privacy Policy</v-card-title>
      <v-card-text>
        <h2>Too Long, Didn't Read</h2>

        <p>
          Information collected by this website is only done as necessary to
          facilitate the application process. Analytics that may exist on this
          website are only for ensuring the stability of the website, such as
          collecting error information. Cookies are only used to store the
          authentication token, thus not requiring users to login after closing
          their browser, and potentially for any togglable website settings.
        </p>

        <h2>Discord &amp; Security</h2>
        <p>
          Our website uses social authentication provided by Discord. The
          permissions our website requests are narrow, only allowing for the
          following information
          <a
            href="https://discord.com/developers/docs/resources/user#user-object"
            target="_blank"
            rel="noreferrer"
            >Discord User Object</a
          >
          without the email address. For developers, the scope of permissions we
          request is <b>identify</b>, found on the
          <a
            href="https://discord.com/developers/docs/topics/oauth2"
            target="_blank"
            rel="noreferrer"
            >Discord OAuth2</a
          >
          page. The only identifiable user information given to us are the
          user's id, username, discriminator or the numbers that are combined
          with the username to form a complete Discord tag, and avatar. The
          authentication flow on Discord's end will confirm the information our
          website is requesting as well, shown below. This is not enough
          information to allow our service to read or send messages to, or on
          behalf, of any of our authenticated users.
        </p>
        <p>
          If a user joins our website's Discord, the website will then be able
          to detect that the user is a member of our website and send messages
          to that user as a notification system for our application process. The
          user is able to stop these notifications by simply leaving our guild's
          Discord at any time.
        </p>
      </v-card-text>
    </v-card>
  </Hero>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    return {
      background: '/images/backgrounds/about-background.jpg',
      title: 'Really Bad Privacy',
      caption: "At least we're not Facebook",
    }
  },
})
</script>
