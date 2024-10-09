<template> 
  <v-form ref="form" class="mx-auto my-3 w-75">
    <div class="d-flex flex-row justify-space-around align-center">
      <InputField name="permissionName" v-model="createFormData.permissionName" label="Permission Name" class="me-2" counter=30 :rules="nameRules" required="true" width=200 />
      <InputField name="redirectUrl" v-model="createFormData.redirectUrl" label="Redirect URL" class="me-2" counter=30 :rules="urlRules" required="true" width=200 />
    </div>
    <div class="d-flex flex-row justify-space-around align-center">
      <InputField name="icon" v-model="createFormData.icon" label="Icon" class="me-2" :rules="iconRules" required="true" width=200 />
    </div>
    <div class="d-flex justify-center align-center">
      <Buttons name="Submit" prepend-icon="fas fa-arrows-rotate" class="mt-4 me-2" color="success" width=200 height=50 @click="validateAndSubmit()"/>
      <Buttons name="Reset" prepend-icon="fas fa-arrows-rotate" class="mt-4" color="error" width=200 height=50 @click="reset()"/>
    </div>
  </v-form>

  <v-dialog v-model="createPermissionResponse" max-width="400">
    <v-card :title="permissionResponseText" class="text-center">
      <div class="d-flex flex-row justify-center align-center mb-2">
        <Buttons name="Ok" prepend-icon="fa-regular fa-circle-xmark" class="mt-4 me-2" color="error" width=150 height=40 @click="createPermissionResponse = false" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { usePermissionStore } from "@/stores/usePermissionStore.vue";
  import InputField from "@/components/TemplateEngine/InputField.vue";
  import Buttons from "@/components/TemplateEngine/Buttons.vue";

  const permissionStore = usePermissionStore();

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

  const createPermissionResponse = ref(false);
  const permissionResponseText = ref(null);

  // Ref for the form
  const form = ref(null);

  const createFormData = ref({
    permissionName: '',
    redirectUrl: '',
    icon: ''
  });

  // Method to validate the form
  async function validateAndSubmit() {
    if (form.value) {
      const { valid } = await form.value.validate();
      if (valid) {
        const response = await permissionStore.createNewPermission(createFormData);

        if (!response) {
          permissionResponseText.value = 'Oops something went wrong!';
          createPermissionResponse.value = true;
        } else {
          router.push({ path: '/superAdmin/permission/list' });
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