<template>
    <v-app-bar
      style="background: linear-gradient(to right,rgba(63, 75, 37, 100), rgba(211, 228, 192, 100))"
      prominent
      class="d-flex justify-space-around align-center px-5"
    >
      <v-toolbar-title class="font-weight-bold text-grey-lighten-2 text-h4">S @ W</v-toolbar-title>

      <v-app-bar-nav-icon>
        <v-icon icon="fas fa-blog"></v-icon>
      </v-app-bar-nav-icon>

      <v-app-bar-nav-icon @click.stop="notify = !notify">
        <v-badge color="#C2185B" content="5" max="9" location="top start">
          <v-icon icon="fas fa-bell"></v-icon>
        </v-badge>
      </v-app-bar-nav-icon>

      <v-app-bar-nav-icon>
        <v-icon v-bind="props" icon="fas fa-user"></v-icon>
        <v-menu activator="parent" location="bottom">
          <v-list min-width=200>
            <v-list-item
              :prepend-avatar="userImage"
              nav
              class="ps-4"
            >
              {{ userName }}
            </v-list-item>
            <v-divider class="my-2"></v-divider>
            <v-list-item
              v-for="([title, icon, link], i) in accountItems"
              :key="i"
              :prepend-icon="icon"
            >
              <RouterLink :to="link" class="text-decoration-none text-black text-body-2">
                <v-list-item-title>{{ title }}</v-list-item-title>
              </RouterLink>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
      v-model="notify"
      location="right"
      temporary
      color="#f8f8f2"
      width=400
      scrim=true
    >
      <v-list
        :items="notifyItems"
        lines="three"
        item-props
      >
        <template v-slot:subtitle="{ subtitle }">
          <div v-html="subtitle"></div>
        </template>
      </v-list>
    </v-navigation-drawer>
</template>

<script setup>
  import { ref } from 'vue';
  import { useAccountStore } from "@/stores/useAccountStore.vue";

  const accountStore = useAccountStore();

  // Define reactive state variables using ref
  const userName = accountStore.getName;
  const userImage = accountStore.getUserImage;
  const props = ref(null);
  const notify = ref(false);
  const notifyItems = ref([
    { type: 'subheader', title: 'Today' },
    {
      prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
      title: 'Brunch this weekend?',
      subtitle: `<span class="text-primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
    },
    { type: 'divider', inset: true },
    {
      prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      title: 'Summer BBQ',
      subtitle: `<span class="text-primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
    },
    { type: 'divider', inset: true },
    {
      prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
      title: 'Oui oui',
      subtitle: '<span class="text-primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
    },
    { type: 'divider', inset: true },
    {
      prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
      title: 'Birthday gift',
      subtitle: '<span class="text-primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
    },
    { type: 'divider', inset: true },
    {
      prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
      title: 'Recipe to try',
      subtitle: '<span class="text-primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
    },
  ]);
  const accountItems = ref([
    ['Account', 'fas fa-circle-info', '/account/profile'],
    ['Logout', 'fas fa-envelopes-bulk', '/account/logout'],
  ]);
</script>