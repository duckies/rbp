<template>
  <v-btn @click="$auth.loginWith('battlenet')">Login</v-btn>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class AuthPage extends Vue {}
</script>
