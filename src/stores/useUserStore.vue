<script lang="ts">
  import { defineStore } from 'pinia';
  import axios from 'axios';
  import type { UserInfo } from "./Interfaces/userInfo";
  import { useAccountStore } from "./useAccountStore.vue";

  export const useUserStore = defineStore('user', {
    state: () => {
      return {
        usersList: [] as UserInfo[],
      }
    },
    getters: {
      getUserList: (state) => state.usersList,
    },
    actions: {
      async fetchUsersList() {
        const accountStore = useAccountStore();
        const bearer = accountStore.getAuthToken;
        
        const response = await axios.get(
          'http://localhost:8070/users',
          {
            headers: {
              "Authorization": `Bearer ` + bearer,
              "Content-Type": `application/json`
            }
          }
        );

        this.usersList = response.data;
      },
      async updateUserListInfo(data) {
        try {
          const accountStore = useAccountStore();
          const bearer = accountStore.getAuthToken;

          const response = await axios.put(
            'http://localhost:8070/users',
            {
              id: data.value['id'] ?? 0,
              firstName: data.value['firstName'] ?? '',
              lastName: data.value['lastName'] ?? '',
              email: data.value['email'] ?? '',
              emailVerified: data.value['verified'] ?? null
            },
            {
              headers: {
                "Authorization": `Bearer ` + bearer,
                "Content-Type": `application/json`
              }
            }
          );

          const updatedUser = response.data;

          this.$patch((state) => {
            if (state.usersList) {
              state.usersList = state.usersList.map((user) => {
                if (user.id === updatedUser.id) {
                  return { ...user, ...updatedUser };
                }
                return user;
              });
            }
          });
        } catch (error) {
          console.error('Error updating user info:  ', error);
        }
      },
      async createNewUser(data) {
        try {
          const accountStore = useAccountStore();
          const bearer = accountStore.getAuthToken;

          const response = await axios.post(
            'http://localhost:8070/users',
            {
              firstName: data.value['firstName'] ?? '',
              lastName: data.value['lastName'] ?? '',
              email: data.value['email'] ?? '',
              password: data.value['password'] ?? '',
              groupId: data.value['group'] ?? ''
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
          console.error('Error creating user: ', error);
          return false;
        }
      },
      async deleteUser(userId) {
        try {
          const accountStore = useAccountStore();
          const bearer = accountStore.getAuthToken;

          const response = await axios.delete(
            'http://localhost:8070/users/' + userId,
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
          console.error('Error deleting user: ', error);
          return false;
        }
      },
    },
  });
</script>