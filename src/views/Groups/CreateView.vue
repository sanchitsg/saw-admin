<template> 
  <v-form ref="form" class="mx-auto my-3 w-75">
    <div class="d-flex flex-row justify-space-around align-center">
      <InputField name="groupName" v-model="createFormData.groupName" label="Group Name" class="me-2" counter=30 :rules="nameRules" required="true" width=200 />
      <v-row>
        <v-col
          cols="6"
        >
          <v-checkbox
            v-for="value in permission"
            v-model="createFormData.permissionId"
            :label="value.name"
            :value="value.id"
            width=200
          ></v-checkbox>
        </v-col>
      </v-row>
    </div>
    <div class="d-flex justify-center align-center">
      <Buttons name="Submit" prepend-icon="fas fa-arrows-rotate" class="mt-4 me-2" color="success" width=200 height=50 @click="validateAndSubmit()"/>
      <Buttons name="Reset" prepend-icon="fas fa-arrows-rotate" class="mt-4" color="error" width=200 height=50 @click="reset()"/>
    </div>
  </v-form>

  <v-dialog v-model="createGroupResponse" max-width="400">
    <v-card :title="groupResponseText" class="text-center">
      <div class="d-flex flex-row justify-center align-center mb-2">
        <Buttons name="Ok" prepend-icon="fa-regular fa-circle-xmark" class="mt-4 me-2" color="error" width=150 height=40 @click="createGroupResponse = false" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useGroupStore } from "@/stores/useGroupStore.vue";
  import { usePermissionStore } from "@/stores/usePermissionStore.vue";
  import InputField from "@/components/TemplateEngine/InputField.vue";
  import Buttons from "@/components/TemplateEngine/Buttons.vue";

  const groupStore = useGroupStore();
  const permissionStore = usePermissionStore();

  await permissionStore.fetchPermissionsList();

  const router = useRouter();

  // Define reactive state variables using ref
  const nameRules = ref([
    v => !!v || 'Name is required',
    v => (v && v.length <= 30) || 'Name must be less than 30 characters',
  ]);
  const urlRules = ref([
    v => !!v || 'URL is required',
    v => (v && v.length <= 100) || 'URL must be less than 100 characters',
  ]);
  const permission = permissionStore.getPermissionsList;

  const createGroupResponse = ref(false);
  const groupResponseText = ref(null);

  // Ref for the form
  const form = ref(null);

  const createFormData = ref({
    groupName: '',
    permissionId: []
  });

  // Method to validate the form
  async function validateAndSubmit() {
    if (form.value) {
      const { valid } = await form.value.validate();
      if (valid) {
        const response = await groupStore.createNewGroup(createFormData);

        if (!response) {
          groupResponseText.value = 'Oops something went wrong!';
          createGroupResponse.value = true;
        } else {
          router.push({ path: '/superAdmin/group/list' });
        }
        
      }
    }
  };

  // Method to reset the form
  async function reset() {
    if (form.value) {
      form.value.reset();
    }
  };
</script>