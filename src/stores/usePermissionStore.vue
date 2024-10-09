<script lang="ts">
  import { defineStore } from 'pinia';
  import axios from 'axios';
  import type { PermissionInfo } from "./Interfaces/permissionInfo";
  import { useAccountStore } from "./useAccountStore.vue";

  export const usePermissionStore = defineStore('permissions', {
    state: () => {
      return {
        permissionsList: [] as PermissionInfo[],
      }
    },
    getters: {
      getPermissionsList: (state) => state.permissionsList,
      getPermissionNameById(state) {
        return (permissionId) => {
          const permission = state.permissionsList.find((permission) => permission.id === permissionId);
          return permission.name;
        }
      },
    },
    actions: {
      async fetchPermissionsList() {
        const accountStore = useAccountStore();
        const bearer = accountStore.getAuthToken;

        const response = await axios.get(
          'http://localhost:8070/permissions',
          {
            headers: {
              "Authorization": `Bearer ` + bearer,
              "Content-Type": `application/json`
            }
          }
        );

        this.permissionsList = response.data;
      },
      async updatePermissionsListInfo(data) {
        try {
          const accountStore = useAccountStore();
          const bearer = accountStore.getAuthToken;

          const response = await axios.put(
            'http://localhost:8070/permissions',
            {
              id: data.value['id'] ?? 0,
              permissionName: data.value['permissionName'] ?? '',
              redirectUrl: data.value['redirectUrl'] ?? ''
            },
            {
              headers: {
                "Authorization": `Bearer ` + bearer,
                "Content-Type": `application/json`
              }
            }
          );

          const updatedPermission = response.data;

          this.$patch((state) => {
            if (state.permissionsList) {
              state.permissionsList = state.permissionsList.map((permission) => {
                if (permission.id === updatedPermission.id) {
                  return { ...permission, ...updatedPermission };
                }
                return permission;
              });
            }
          });
        } catch (error) {
          console.error('Error updating permission info:  ', error);
        }
      },
      async createNewPermission(data) {
        try {
          const accountStore = useAccountStore();
          const bearer = accountStore.getAuthToken;

          const response = await axios.post(
            'http://localhost:8070/permissions',
            {
              permissionName: data.value['permissionName'] ?? '',
              redirectUrl: data.value['redirectUrl'] ?? '',
              icon: data.value['icon'] ?? ''
            },
            {
              headers: {
                "Authorization": `Bearer ` + bearer,
                "Content-Type": `application/json`
              }
            }
          );

          if (response.status === 201) {
            return true;
          }

          return false;
        } catch (error) {
          console.error('Error creating permission: ', error);
          return false;
        }
      },
      async deletePermission(permissionId) {
        try {
          const accountStore = useAccountStore();
          const bearer = accountStore.getAuthToken;

          const response = await axios.delete(
            'http://localhost:8070/permissions/' + permissionId,
            {
              headers: {
                "Authorization": `Bearer ` + bearer,
                "Content-Type": `application/json`
              }
            }
          );

          if (response.status === 200) {
            return true;
          }

          return false;
        } catch (error) {
          console.error('Error deleting permission: ', error);
          return false;
        }
      },
    },
  });
</script>