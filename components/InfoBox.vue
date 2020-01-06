<template>
  <v-card class="mb-4">
    <v-img :src="background" gradient="to bottom, rgba(32, 33, 36, 0.3), #202124">
      <v-card-title class="pa-4">
        <span class="headline" v-text="title" />
        <span class="subtitle" v-text="subtitle" />
      </v-card-title>

      <v-card-actions>
        <v-btn text :to="buttonLink" color="primary" class="button">
          {{ buttonText }}
          <v-icon right>
            mdi-chevron-right
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-img>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    background: {
      type: String,
      required: true
    },
    buttonLink: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.headline {
  width: 100%;
  font-size: 25px;
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
}

.subtitle {
  font-size: 17px;
  line-height: 1.1;
  opacity: 0.7;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.button {
  font-weight: 700;
  font-size: 15px;
}
</style>
