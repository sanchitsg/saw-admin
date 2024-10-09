<script lang="ts">
  import { defineStore } from 'pinia';
  import axios from 'axios';
  import type { AccountInfo } from "./Interfaces/accountInfo";
  import { useGroupStore } from "@/stores/useGroupStore.vue";
  import { usePermissionStore } from "@/stores/usePermissionStore.vue";

  export const useAccountStore = defineStore('account', {
    state: () => {
      if (sessionStorage.getItem("account_store_data"))
        return {
          accountInfo: JSON.parse(sessionStorage.getItem("account_store_data"))
        }
      else
        return {
          accountInfo: {} as AccountInfo,
        }
    },
    getters: {
      getAuthToken: (state) => {
        const sessionToken = sessionStorage.getItem('auth_token') ?? null;
        if (!state.accountInfo.authToken) {
          state.accountInfo.authToken = sessionToken;
        }

        return state.accountInfo.authToken
      },
      getAuthStatus: (state) => {
        const sessionToken = sessionStorage.getItem('auth_token') ?? null;
        if (!state.accountInfo.authToken) {
          state.accountInfo.authToken = sessionToken;
        }
        
        if (state.accountInfo.authToken) {
          return true;
        }
        return false;
      },
      getName: (state) => state.accountInfo.userDetails?.firstName + ' ' + state.accountInfo.userDetails?.lastName,
      getUserGroup: (state) => state.accountInfo.userDetails?.userGroup,
      getUserImage: (state) => {
        if (state.accountInfo.userDetails?.userImage) {
          return state.accountInfo.userDetails.userImage;
        } else {
          return 'https://randomuser.me/api/portraits/men/85.jpg';
        }
      },
      getEmail: (state) => state.accountInfo.userDetails?.email,
      getPhone: (state) => state.accountInfo.userDetails?.phone,
      getSecurityInfo: (state) => {
        let securityData = [];

        if (state.accountInfo.userDetails?.email) {
          securityData.push(['Email', 'email', state.accountInfo.userDetails?.email]);
        }
        if (state.accountInfo.userDetails?.phone) {
          securityData.push(['Phone / Mobile', 'phone', state.accountInfo.userDetails?.phone]);
        }

        return securityData;
      },
      getNotifyInfo: (state) => {
        let finalNotifyData = [];
        let notifyData = [];

        if (state.accountInfo.userDetails?.email || state.accountInfo.userDetails?.phone) {
          notifyData.push('How would you prefer to be notified?');
          let emailPhoneData = [];
          if (state.accountInfo.userDetails?.email) {
            emailPhoneData.push(['Email', 'email']);
          }
          if (state.accountInfo.userDetails?.phone) {
            emailPhoneData.push(['Phone / Mobile', 'phone']);
          }
          notifyData.push(emailPhoneData);

          let selectedData = [];
          if (state.accountInfo.notify?.emailNotify) selectedData.push('email');
          if (state.accountInfo.notify?.phoneNotify) selectedData.push('phone');

          notifyData.push(selectedData);
        }

        finalNotifyData.push(notifyData);
        return finalNotifyData;
      },
      getNotifyData: (state) => state.accountInfo.notify,
      getUserInfo: (state) => {
        const data = {
          FirstName: state.accountInfo.userDetails?.firstName,
          LastName: state.accountInfo.userDetails?.lastName,
          UserGroup: state.accountInfo.userDetails?.userGroup,
          Email: state.accountInfo.userDetails?.email,
          Phone: state.accountInfo.userDetails?.phone,
          DOB: state.accountInfo.userDetails?.dob,
          Gender: state.accountInfo.userDetails?.gender,
        };
        return data;
      },
    },
    actions: {
      async login(loginData) {
        if (loginData.email && loginData.password) {
          try {
            const response = await axios.post(
              'http://localhost:8070/users/login',
              loginData,
              {
                headers: {
                  "Content-Type": `application/json`
                }
              }
            );

            if (response.status === 201) {
              this.accountInfo = {
                userDetails: {
                  firstName: response.data.firstName ?? '',
                  lastName: response.data.lastName ?? '',
                  userGroup: response.data.userGroup ?? '',
                  userImage: response.data.userImage ?? '',
                  email: response.data.email ?? '',
                  phone: response.data.phone ?? '',
                  emailVerified: response.data.emailVerified ?? '',
                  dob: response.data.dob ?? '',
                  gender: response.data.gender ?? '',
                },
                security: {
                  emailVerified: response.data.emailVerified ?? '',
                  phoneVerified: response.data.phoneVerified ?? '',
                },
                notify: {
                  emailNotify: true,
                  phoneNotify: false,
                },
                authToken: response.data.authToken ?? '',
              }
              sessionStorage.setItem("account_store_data", JSON.stringify(this.accountInfo) ?? null);
              sessionStorage.setItem("auth_token", response.data.authToken ?? null);

              return true;
            }

            return false;
          } catch (error) {
            console.log(error.message);
            return false;
          }
        }
      },
      async register(registerData) {
        try {
          const response = await axios.post(
            'http://localhost:8070/users/register',
            registerData,
            {
              headers: {
                "Content-Type": `application/json`
              }
            }
          );

          if (response.status === 201) {
            this.accountInfo = {
              userDetails: {
                firstName: response.data.firstName ?? '',
                lastName: response.data.lastName ?? '',
                userGroup: response.data.userGroup ?? '',
                userImage: response.data.userImage ?? '',
                email: response.data.email ?? '',
                phone: response.data.phone ?? '',
                emailVerified: response.data.emailVerified ?? '',
                dob: response.data.dob ?? '',
                gender: response.data.gender ?? '',
              },
              security: {
                emailVerified: false,
                phoneVerified: false,
              },
              notify: {
                emailNotify: true,
                phoneNotify: false,
              },
              authToken: response.data.authToken ?? '',
            }
            return true;
          }

          return false;
        } catch (error) {
          console.error('Error registering user: ', error);
          return false;
        }
      },
      async sidebarMenus() {
        try {
          const userGroup = this.accountInfo.userDetails?.userGroup;
          const groupStore = useGroupStore();
          const permissionStore = usePermissionStore();
          await permissionStore.fetchPermissionsList();
          await groupStore.fetchGroupsList();
          const groupList = groupStore.getGroupsList;
          const group = groupList.find((group) => group.name === userGroup);
          const userGroupPermissions = group?.permission ?? [];
          const permissionNames = userGroupPermissions?.flatMap(el => permissionStore.getPermissionNameById(el.permission_id));

          return permissionNames;
        } catch (error) {
          console.log('Error in Sidebar Menu: ', error);
          return [];
        }
      },
      async logout() {
        try {
          const bearer = this.accountInfo.authToken;
          const response = await axios.post(
            'http://localhost:8070/users/logout',
            {
              authToken: bearer
            },
            {
              headers: {
                "Content-Type": `application/json`
              }
            }
          );

          if (response.status === 201) {
            this.accountInfo = null;
            sessionStorage.removeItem("account_store_data");
            sessionStorage.removeItem('auth_token');
            return true;
          }

          return false;
        } catch (error) {
          console.log(error.message);
          return false;
        }
      },
      updateUserEmail(data) {
        if (data.email) {
          this.accountInfo.userDetails.email = data.email
        }
      },
      updateUserPhone(data) {
        if (data.phone) {
          this.accountInfo.userDetails.phone = data.phone
        }
      },
      updateUserContacts(data) {
        this.accountInfo.userDetails.email = data.email ?? this.accountInfo.userDetails.email
        this.accountInfo.userDetails.phone = data.phone ?? this.accountInfo.userDetails.phone
      },
      updateUserNotifications(data) {
        this.accountInfo.notify.emailNotify = data.emailNotify ?? this.accountInfo.notify.emailNotify
        this.accountInfo.notify.phoneNotify = data.phoneNotify ?? this.accountInfo.notify.phoneNotify
      },
    }
  });
</script>