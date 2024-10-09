<template>
  <v-data-table
    :headers="headers"
    :items="permissions"
    class="mx-auto my-3 w-75"
  >
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

  <v-dialog v-model="updatePermissionInfo" max-width="800">
    <v-card title="Update Permission Info">
      <template v-slot:text>
        <v-form ref="form" class="mx-auto">
          <div class="d-flex flex-row justify-space-around align-center">
            <InputField name="permissionName" v-model="updateFormData.permissionName" :value="updateFormData.permissionName" class="me-2" counter=30 :rules="nameRules" required="true" width=200 />
            <InputField name="redirectUrl" v-model="updateFormData.redirectUrl" :value="updateFormData.redirectUrl" class="me-2" counter=30 :rules="urlRules" required="true" width=200 />
          </div>
          <div class="d-flex flex-row justify-center align-center">
            <Buttons name="Update" prepend-icon="fas fa-pen" class="mt-4 me-2" color="success" width=200 height=50 @click="confirmUpdate = true" />
            <Buttons name="Cancel" prepend-icon="fa-regular fa-circle-xmark" class="mt-4 me-2" color="error" width=200 height=50 @click="updatePermissionInfo = false" />
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
  import { usePermissionStore } from "@/stores/usePermissionStore.vue";

  const permissionStore = usePermissionStore();
  await permissionStore.fetchPermissionsList();

  const router = useRouter();

  const headers = ref([
    { title: 'Id', align: 'center', value: 'id', sortable: true },
    { title: 'Name', align: 'center', value: 'name', sortable: true },
    { title: 'Icon', align: 'center', value: 'icon', sortable: true },
    { title: 'Redirect URL', align: 'center', value: 'redirect_url', sortable: true },
    { title: 'Actions', align: 'center', key: 'actions', sortable: false },
  ]);
  const permissions = permissionStore.getPermissionsList;

  const updatePermissionInfo = ref(false);
  const confirmUpdate = ref(false);
  const deleteError = ref(false);

  const updateFormData = ref({
    id: 0,
    permissionName: '',
    icon: '',
    redirectUrl: ''
  });
  const nameRules = ref([
    v => !!v || 'Name is required',
    v => (v && v.length <= 30) || 'Name must be less than 30 characters',
  ]);
  const urlRules = ref([
    v => !!v || 'URL is required',
    v => (v && v.length <= 100) || 'URL must be less than 100 characters',
  ]);

  function editItem(permissionData) {
    updateFormData.value['id'] = permissionData.id;
    updateFormData.value['permissionName'] = permissionData.name;
    updateFormData.value['icon'] = permissionData.icon;
    updateFormData.value['redirectUrl'] = permissionData.redirect_url;
    updatePermissionInfo.value = true;
  }

  async function confirmEdit() {
    await permissionStore.updatePermissionsListInfo(updateFormData);
    permissions.value = permissionStore.getPermissionsList;
    confirmUpdate.value = false;
    updatePermissionInfo.value = false;
    router.go(0);
  }

  function cancelEdit() {
    confirmUpdate.value = false;
    updatePermissionInfo.value = false;
  }

  async function deleteItem(permissionId) {
    const response = await permissionStore.deletePermission(permissionId);

    if (response) {
      router.go(0);
    } else {
      deleteError.value = true;
    }
  }
</script>