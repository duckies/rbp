<template>
  <v-card class="border-card mb-4" height="300">
    <v-img :src="background" height="300" class="card-expand" gradient="to bottom, rgba(32, 33, 36, 0.3), #202124">
      <v-layout fill-height>
        <v-row no-gutters align-content="end">
          <v-col class="px-3">
            <v-card-title class="headline" v-text="title" />
            <v-card-subtitle v-text="subtitle" />

            <v-card-actions>
              <v-btn text :href="buttonLink" color="primary" class="button" rel="noreferrer">
                {{ buttonText }}
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-layout>
    </v-img>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      required: true,
    },
    buttonLink: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.headline {
  width: 100%;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
}

.subtitle {
  font-size: 0.9rem;
  line-height: 1.1;
  opacity: 0.7;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.button {
  font-weight: 700;
  font-size: 15px;
}
</style>
