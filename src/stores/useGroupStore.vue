<script lang="ts">
  import { defineStore } from 'pinia';
  import axios from 'axios';
  import type { GroupInfo } from "./Interfaces/groupInfo";
  import { useAccountStore } from "./useAccountStore.vue";

  export const useGroupStore = defineStore('groups', {
    state: () => {
      return {
        groupsList: [] as GroupInfo[],
      }
    },
    getters: {
      getGroupsList: (state) => state.groupsList,
    },
    actions: {
      async fetchGroupsList() {
        const accountStore = useAccountStore();
        const bearer = accountStore.getAuthToken;

        const response = await axios.get(
          'http://localhost:8070/groups',
          {
            headers: {
              "Authorization": `Bearer ` + bearer,
              "Content-Type": `application/json`
            }
          }
        );

        this.groupsList = response.data;
      },
      async updateGroupsListInfo(data) {
        try {
          const accountStore = useAccountStore();
          const bearer = accountStore.getAuthToken;

          const response = await axios.put(
            'http://localhost:8070/groups',
            {
              groupId: data.value['id'] ?? 0,
              groupName: data.value['groupName'] ?? '',
              permissionId: data.value['permissionId'] ?? ''
            },
            {
              headers: {
                "Authorization": `Bearer ` + bearer,
                "Content-Type": `application/json`
              }
            }
          );

          const updatedGroup = response.data;

          this.$patch((state) => {
            if (state.groupsList) {
              state.groupsList = state.groupsList.map((group) => {
                if (group.id === updatedGroup.id) {
                  return { ...group, ...updatedGroup };
                }
                return group;
              });
            }
          });
        } catch (error) {
          console.error('Error updating group info:  ', error);
        }
      },
      async createNewGroup(data) {
        try {
          const accountStore = useAccountStore();
          const bearer = accountStore.getAuthToken;

          const response = await axios.post(
            'http://localhost:8070/groups',
            {
              groupName: data.value['groupName'] ?? '',
              permissionId: data.value['permissionId'] ?? ''
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
          console.error('Error creating group: ', error);
          return false;
        }
      },
      async deleteGroup(groupId) {
        try {
          const accountStore = useAccountStore();
          const bearer = accountStore.getAuthToken;

          const response = await axios.delete(
            'http://localhost:8070/groups/' + groupId,
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
          console.error('Error deleting group: ', error);
          return false;
        }
      },
    },
  });
</script>