<template>
  <v-app dark>
    <v-navigation-drawer app permanent>
      <v-list dense nav>
        <v-list-item to="/admin" exact>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/admin/slides">
          <v-list-item-icon>
            <v-icon>mdi-picture</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Slides</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-title>RBP Admin</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>
