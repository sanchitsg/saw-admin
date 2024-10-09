<template>
  <HeaderView />
  <SidebarView />
  <v-sheet rounded="rounded" class="my-6">
    <div class="d-flex flex-column justify-start">
      <h2 class="pb-6 text-center">{{ section }} {{ feature }}</h2>
      <div v-if="feature === 'Create'">
        <CreateView />
      </div>
      <div v-else-if="feature === 'List'">
        <ListView />
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
  import CreateView from "./CreateView.vue";
  import ListView from "./ListView.vue";

  const props = defineProps({
    section: {
        type: String,
        required: true,
        default: 'User'
    },
    feature: {
        type: String,
        required: true,
        default: 'List'
    },
  });
</script>