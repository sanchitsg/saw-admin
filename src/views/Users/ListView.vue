<template>
  <v-data-table
    :headers="headers"
    :items="users"
    class="mx-auto my-3 w-75"
  >
    <template v-slot:item.userGroup="{ item }">
      <v-chip
        :color="getRoleColor(item)"
      >
        {{ getRole(item) }}
      </v-chip>
    </template>

    <template v-slot:item.verified="{ item }">
      <v-icon
        v-if="item.verified"
        color="success"
        icon="fas fa-check-circle"
        size="large"
      ></v-icon>
      <v-icon
        v-else
        color="error"
        icon="fas fa-circle-xmark"
        size="large"
      ></v-icon>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn-group
        variant="outlined"
        color="blue-grey-lighten-3"
        divided
        class="my-2"
      >
        <v-btn @click="editItem(item)">
          <v-icon icon="fas fa-pen" color="primary"></v-icon>
        </v-btn>
        <v-btn @click="deleteItem(item.id)">
          <v-icon icon="fas fa-trash-can" color="error"></v-icon>
        </v-btn>
      </v-btn-group>
    </template>
  </v-data-table>

  <v-dialog v-model="updateUserInfo" max-width="800">
    <v-card title="Update User Info">
      <template v-slot:text>
        <v-form ref="form" class="mx-auto">
          <div class="d-flex flex-row justify-space-around align-center">
            <InputField name="firstName" v-model="updateFormData.firstName" :value="updateFormData.firstName" class="me-2" counter=30 :rules="nameRules" required="true" width=200 />
            <InputField name="lastName" v-model="updateFormData.lastName" :value="updateFormData.lastName" class="me-2" counter=30 :rules="nameRules" required="true" width=200 />
          </div>
          <div class="d-flex flex-row justify-space-around align-center">
            <InputField name="email" v-model="updateFormData.email" :value="updateFormData.email" class="me-2" counter=30 :rules="emailRules" required="true" width=200 />
          </div>
          <div class="d-flex flex-row justify-center align-center">
            <Buttons name="Update" prepend-icon="fas fa-pen" class="mt-4 me-2" color="success" width=200 height=50 @click="confirmUpdate = true" />
            <Buttons name="Cancel" prepend-icon="fa-regular fa-circle-xmark" class="mt-4 me-2" color="error" width=200 height=50 @click="updateUserInfo = false" />
          </div>
        </v-form>
      </template>
    </v-card>
  </v-dialog>

  <v-dialog v-model="confirmUpdate" max-width="400">
    <v-card title="Are you sure about the changes?" class="text-center">
      <div class="d-flex flex-row justify-center align-center mb-2">
        <Buttons name="Yes" prepend-icon="fa-regular fa-circle-check" class="mt-4 me-2" color="success" width=150 height=40 @click="confirmEdit()" />
        <Buttons name="No" prepend-icon="fa-regular fa-circle-xmark" class="mt-4" color="error" width=150 height=40 @click="cancelEdit()" />
      </div>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteError" max-width="400">
    <v-card title="Unable to delete this user! Please try again." class="text-center">
      <div class="d-flex flex-row justify-center align-center mb-2">
        <Buttons name="Go Back" prepend-icon="fa-regular fa-circle-xmark" class="mt-4" color="error" width=150 height=40 @click="deleteError = false;" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref } from "vue";
  import { useRouter } from 'vue-router';
  import InputField from "@/components/TemplateEngine/InputField.vue";
  import Buttons from "@/components/TemplateEngine/Buttons.vue";
  import { useUserStore } from "@/stores/useUserStore.vue";

  const userStore = useUserStore();
  await userStore.fetchUsersList();

  const router = useRouter();

  const headers = ref([
    { title: 'Id', align: 'center', value: 'id', sortable: true },
    { title: 'Name', align: 'center', key: 'fullName', value: item => `${item.firstName} ${item.lastName}`, sortable: true },
    { title: 'Role', align: 'center', value: 'userGroup', sortable: true },
    { title: 'Email', align: 'center', value: 'email', sortable: true },
    { title: 'Verified', align: 'center', value: 'verified', sortable: false },
    { title: 'Actions', align: 'center', key: 'actions', sortable: false },
  ]);
  const users = userStore.getUserList;

  const updateUserInfo = ref(false);
  const confirmUpdate = ref(false);
  const deleteError = ref(false);

  const updateFormData = ref({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    verified: false
  });
  const nameRules = ref([
    v => !!v || 'Name is required',
    v => (v && v.length <= 30) || 'Name must be less than 30 characters',
  ]);
  const emailRules = ref([
    v => !!v || 'Email is required',
    v => (v && v.length <= 30) || 'Please enter valid email',
  ]);

  function getRole(users) {
    const str = users.userGroup ?? '';

    if (str) {
      return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    } else {
      return 'NA';
    }
  }

  function getRoleColor(users) {
    const str = users.userGroup ?? '';

    if (str === 'super admin') {
      return 'red';
    } else if (str === 'admin') {
      return 'primary';
    } else {
      return '';
    }
  }

  function editItem(userData) {
    updateFormData.value['id'] = userData.id;
    updateFormData.value['firstName'] = userData.firstName;
    updateFormData.value['lastName'] = userData.lastName;
    updateFormData.value['email'] = userData.email;
    updateFormData.value['verified'] = userData.verified;
    updateUserInfo.value = true;
  }

  async function confirmEdit() {
    await userStore.updateUserListInfo(updateFormData);
    users.value = userStore.getUserList;
    confirmUpdate.value = false;
    updateUserInfo.value = false;
    router.go(0);
  }

  function cancelEdit() {
    confirmUpdate.value = false;
    updateUserInfo.value = false;
  }

  async function deleteItem(userId) {
    const response = await userStore.deleteUser(userId);

    if (response) {
      router.go(0);
    } else {
      deleteError.value = true;
    }
  }
</script>