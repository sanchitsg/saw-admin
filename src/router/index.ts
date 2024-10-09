import { createRouter, createWebHistory } from 'vue-router';
import { useAccountStore } from "@/stores/useAccountStore.vue";
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import AccountView from '@/views/Accounts/AccountView.vue'
import UsersView from '@/views/Users/UsersView.vue';
import GroupsView from '@/views/Groups/GroupsView.vue';
import PermissionsView from '@/views/Permissions/PermissionsView.vue';
import ProjectsView from '@/views/Projects/ProjectsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LoginView, name: 'Login' },
    { path: '/home', component: HomeView },
    {
      path: '/projects',
      children: [
        {
          path: 'list',
          component: ProjectsView,
          props: { section: 'Project', feature: 'List' }
        },
        {
          path: 'create',
          component: ProjectsView,
          props: { section: 'Project', feature: 'Create' }
        },
      ]
    },
    {
      path: '/superAdmin/',
      children: [
        {
          path: 'permission',
          children: [
            {
              path: 'list',
              component: PermissionsView,
              props: { section: 'Permission', feature: 'List' }
            },
            {
              path: 'create',
              component: PermissionsView,
              props: { section: 'Permission', feature: 'Create' }
            },
          ]
        },
        {
          path: 'group',
          children: [
            {
              path: 'list',
              component: GroupsView,
              props: { section: 'Group', feature: 'List' }
            },
            {
              path: 'create',
              component: GroupsView,
              props: { section: 'Group', feature: 'Create' }
            },
          ]
        },
        {
          path: 'user',
          children: [
            {
              path: 'list',
              component: UsersView,
              props: { section: 'User', feature: 'List' }
            },
            {
              path: 'create',
              component: UsersView,
              props: { section: 'User', feature: 'Create' }
            },
          ]
        },
      ]
    },
    {
      path: '/account/',
      children: [
        {
          path: 'profile',
          component: AccountView,
          props: { section: 'Profile' }
        },
        {
          path: 'logout',
          component: AccountView,
          props: { section: 'Logout' }
        },
      ]
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/'];
  const authRequired = !publicPages.includes(to.path);
  const accountStore = useAccountStore();
  const isAuthenticated = accountStore.getAuthStatus;

  if (authRequired && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.path === '/account/logout') {
    const logout = await accountStore.logout();
    if (!logout) {
      next({ path: from.path });
    } else {
      router.go(0);
    }
  } else {
    next();
  }
})

export default router
