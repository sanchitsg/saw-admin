<template>
  <HeaderView />
  <SidebarView />
  <v-card
    class="mx-auto text-center"
    width="800"
    color="#f8f8f2"
    rounded="50"
  >
    <template v-slot:title>
      <v-icon icon="fas fa-house-circle-check" color="green-darken-4" class="me-5 mb-3"></v-icon>
      <span class="text-green-darken-4 font-weight-bold">Welcome to S@W Admin</span>
    </template>
    <template v-slot:subtitle>
      <span class="text-body-2 text-black">Let's get to work</span>
    </template>

    <v-card-text class="pt-4 d-flex flex-column align-center">
      <span>
        This panel will allow you to maintain and update all editable functionalities related to the website
        "<strong>sanchitatwork.com</strong>". You can perform the "<strong>CRUD</strong>" functions, depending on the access available to you!
      </span>
      <v-list lines="two" bg-color="transparent" disabled>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue';
  import HeaderView from "@/views/Layouts/HeaderView.vue";
  import SidebarView from "@/views/Layouts/SidebarView.vue";

  const items = ref([
    { text: 'Users', icon: 'fas fa-user-tie' },
    { text: 'Permissions', icon: 'fas fa-toolbox' },
    { text: 'Groups', icon: 'fas fa-people-group' },
    { text: 'Projects', icon: 'fas fa-diagram-project' },
  ]);
</script>