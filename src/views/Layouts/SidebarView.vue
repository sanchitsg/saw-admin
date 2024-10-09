<template>
    <v-navigation-drawer
      expand-on-hover
      rail
      color="#f8f8f2"
      width=300
    >
      <v-list density="compact" nav>
        <v-list-item prepend-icon="fas fa-home" height="60">
          <RouterLink to="/home" class="text-decoration-none text-black text-body-2 font-weight-bold">Home</RouterLink>
        </v-list-item>

        <div v-if="showProjectMenu">
          <v-list-group value="projects">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="fas fa-diagram-project"
                value="projects"
                class="text-body-2 font-weight-bold"
              >
                Projects
              </v-list-item>
            </template>
            <v-list-item
              v-for="([titleSub, iconSub, linkSub], j) in subMenuItems"
              :key="j"
              :prepend-icon="iconSub"
              class="text-body-2"
            >
              <RouterLink :to="computedLink('/projects', linkSub)" class="text-decoration-none text-black">{{ titleSub }}</RouterLink>
            </v-list-item>
          </v-list-group>
        </div>
        
        <v-list-group v-if="showSuperAdminMenu" value="superAdmin">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="fas fa-mask"
              value="superAdmin"
              class="text-body-2 font-weight-bold"
            >
              Super Admin
            </v-list-item>
          </template>
          <v-list-group
            v-for="([titleMain, iconMain, linkMain], i) in superAdminMainItems"
            :key="i"
            :value="titleMain"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :key="i"
                :prepend-icon="iconMain"
                class="text-body-2"
              >
                {{ titleMain }}
              </v-list-item>
            </template>

            <v-list-item
              v-for="([titleSub, iconSub, linkSub], j) in subMenuItems"
              :key="j"
              :prepend-icon="iconSub"
              class="text-body-2"
            >
              <RouterLink :to="computedLink(linkMain, linkSub)" class="text-decoration-none text-black">{{ titleSub }}</RouterLink>
            </v-list-item>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useAccountStore } from "@/stores/useAccountStore.vue";

  const superAdminMenu = ref([
    ['Users', 'fas fa-user-tie', '/superAdmin/user', true],
    ['Permissions', 'fas fa-toolbox', '/superAdmin/permission', true],
    ['Groups', 'fas fa-people-group', '/superAdmin/group', true]
  ]);

  const accountStore = useAccountStore();
  //User Group of the current logged in user.
  const sidebarMenus = await accountStore.sidebarMenus();  

  const showHomeMenu = computed(() => {
    return sidebarMenus.find(menu => menu === "Dashboard") ? true : false
  });
  const showProjectMenu = computed(() => {
    return sidebarMenus.find(menu => menu === "Projects") ? true : false
  });
  const showSuperAdminMenu = computed(() => {
    return sidebarMenus.find(menu => menu === "Super Admin") ? true : false
  });

  // Define reactive state variables using ref
  const superAdminMainItems = ref([
    ['Users', 'fas fa-user-tie', '/superAdmin/user'],
    ['Permissions', 'fas fa-toolbox', '/superAdmin/permission'],
    ['Groups', 'fas fa-people-group', '/superAdmin/group']
  ]);
  const subMenuItems = ref([
    ['List All', 'fa-brands fa-readme', '/list'],
    ['Create New', 'fas fa-square-plus', '/create'],
  ]);

  function computedLink(main, sub) {
    return main + sub;
  }
</script>