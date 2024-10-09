<template>
  <v-data-table
    :headers="headers"
    :items="groups"
    class="mx-auto my-3 w-75"
  >
    <template v-slot:item.permission="{ item }">
      {{ getPermissionNames(item) }}
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

  <v-dialog v-model="updateGroupInfo" max-width="800">
    <v-card title="Update Group Info">
      <template v-slot:text>
        <v-form ref="form" class="mx-auto">
          <div class="d-flex flex-row justify-space-around align-center">
            <InputField name="groupName" v-model="updateFormData.groupName" :value="updateFormData.groupName" class="me-2" counter=30 :rules="nameRules" required="true" width=200 />
            <v-row>
              <v-col
                cols="6"
              >
                <v-checkbox
                  v-for="value in permission"
                  v-model="updateFormData.permissionId"
                  :label="value.name"
                  :value="value.id"
                  width=200
                ></v-checkbox>
              </v-col>
            </v-row>
          </div>
          <div class="d-flex flex-row justify-center align-center">
            <Buttons name="Update" prepend-icon="fas fa-pen" class="mt-4 me-2" color="success" width=200 height=50 @click="confirmUpdate = true" />
            <Buttons name="Cancel" prepend-icon="fa-regular fa-circle-xmark" class="mt-4 me-2" color="error" width=200 height=50 @click="updateGroupInfo = false" />
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
    <v-card title="Unable to delete this group! Please try again." class="text-center">
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
  import RadioGroup from "@/components/TemplateEngine/RadioGroup.vue";
  import Buttons from "@/components/TemplateEngine/Buttons.vue";
  import { useGroupStore } from "@/stores/useGroupStore.vue";
  import { usePermissionStore } from "@/stores/usePermissionStore.vue";

  const groupStore = useGroupStore();
  const permissionStore = usePermissionStore();

  await permissionStore.fetchPermissionsList();
  await groupStore.fetchGroupsList();

  const router = useRouter();

  const headers = ref([
    { title: 'Id', align: 'center', value: 'id', sortable: true },
    { title: 'Group', align: 'center', value: 'name', sortable: true },
    { title: 'Permissions', align: 'center', value: 'permission', sortable: false },
    { title: 'Actions', align: 'center', key: 'actions', sortable: false },
  ]);
  const groups = groupStore.getGroupsList;
  const permission = permissionStore.getPermissionsList;

  const updateGroupInfo = ref(false);
  const confirmUpdate = ref(false);
  const deleteError = ref(false);

  const updateFormData = ref({
    id: 0,
    groupName: '',
    permissionId: []
  });
  const nameRules = ref([
    v => !!v || 'Name is required',
    v => (v && v.length <= 30) || 'Name must be less than 30 characters',
  ]);
  const urlRules = ref([
    v => !!v || 'URL is required',
    v => (v && v.length <= 100) || 'URL must be less than 100 characters',
  ]);

  function getPermissionNames(groups) {
    // Get permission names directly using flatMap and optional chaining
    const permissionNames = groups.permission?.flatMap(el => permissionStore.getPermissionNameById(el.permission_id));

    // If permissionNames exists, join them with commas
    return permissionNames?.join(', ') || 'NA';
  }

  function editItem(groupData) {
    updateFormData.value['id'] = groupData.id;
    updateFormData.value['groupName'] = groupData.name;

    let permissionId = [];
    if (groupData.permission) {
      groupData.permission.forEach(el => {
        permissionId.push(el.permission_id);
      });
    }
    updateFormData.value['permissionId'] = permissionId;
    updateGroupInfo.value = true;
  }

  async function confirmEdit() {
    await groupStore.updateGroupsListInfo(updateFormData);
    groups.value = groupStore.getGroupsList;
    confirmUpdate.value = false;
    updateGroupInfo.value = false;
    router.go(0);
  }

  function cancelEdit() {
    confirmUpdate.value = false;
    updateGroupInfo.value = false;
  }

  async function deleteItem(groupId) {
    const response = await groupStore.deleteGroup(groupId);

    if (response) {
      router.go(0);
    } else {
      deleteError.value = true;
    }
  }
</script>