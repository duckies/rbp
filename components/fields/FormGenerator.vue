<template>
  <ValidationObserver ref="observer" v-slot="{ invalid, passes }" slim>
    <v-form @submit="passes(submit)">
      <v-card v-for="(field, index) in schema" :key="index" class="mb-4">
        <v-card-title>
          <span class="field--title">{{ field.question }}</span>
          <span v-if="field.hint" class="field--hint">{{ field.hint }}</span>
        </v-card-title>

        <v-card-text>
          <component :is="field.type" v-model="value[field.uuid]" :field="field" />
        </v-card-text>
      </v-card>

      <v-btn type="submit">Submit</v-btn>
    </v-form>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { ValidationObserver } from 'vee-validate'
import TextArea from './TextArea.vue'
import TextInput from './TextInput.vue'
import Select from './Select.vue'
import Checkbox from './Checkbox.vue'

@Component({
  components: { TextArea, TextInput, Select, Checkbox, ValidationObserver }
})
export default class FormGenerator extends Vue {
  @Prop() private readonly schema!: JSON
  @Prop() private readonly value!: JSON

  public valid = false
}
</script>
