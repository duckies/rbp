<template>
  
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Ranks } from '@/store/auth'
import { Character } from '@/store/character'

@Component
export default class CharacterPanel extends Vue {
  @Prop() readonly character!: Character
}
</script>