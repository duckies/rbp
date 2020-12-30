<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  fetch({ redirect }) {
    redirect(302, `/applications/open`)
  },
})
export default class Application extends Vue {}
</script>
