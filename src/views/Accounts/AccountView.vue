<template>
  <HeaderView v-if="section === 'Profile'" />
  <SidebarView v-if="section === 'Profile'" />
  <v-sheet rounded="rounded" class="my-6">
    <div class="d-flex flex-column justify-start">
      <div v-if="section === 'Profile'">
        <ProfileView />
      </div>
      <div v-else-if="section === 'Logout'">
        <LoginView />
      </div>
      <div v-else>
        <h3>Not Allowed!</h3>
      </div>
    </div>
  </v-sheet>
</template>

<script setup>
  import HeaderView from "@/views/Layouts/HeaderView.vue";
  import SidebarView from "@/views/Layouts/SidebarView.vue";
  import ProfileView from "./ProfileView.vue";
  import LoginView from "@/views/LoginView.vue";

  const props = defineProps({
    section: {
        type: String,
        required: true,
        default: 'User'
    },
  });
</script>