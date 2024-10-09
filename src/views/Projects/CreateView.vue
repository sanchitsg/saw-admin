<template> 
  <v-form ref="form" class="mx-auto my-3 w-75">
    <div class="d-flex flex-row justify-space-around align-center">
      <InputField name="title" v-model="createFormData.title" label="Project Title" class="me-2" counter=30 :rules="nameRules" required="true" width=200 />
      <TextArea name="description" v-model="createFormData.description" label="Project Description" width=200 />
    </div>
    <div class="d-flex flex-row justify-space-around align-center">
      <InputField name="redirectUrl" v-model="createFormData.redirectUrl" label="Project URL" class="me-2" :rules="urlRules" required="true" width=200 />
      <InputField name="imageUrl" v-model="createFormData.imageUrl" label="Image URL" class="me-2" :rules="urlRules" required="true" width=200 />
    </div>
    <div class="d-flex justify-center align-center">
      <Buttons name="Submit" prepend-icon="fas fa-arrows-rotate" class="mt-4 me-2" color="success" width=200 height=50 @click="validateAndSubmit()"/>
      <Buttons name="Reset" prepend-icon="fas fa-arrows-rotate" class="mt-4" color="error" width=200 height=50 @click="reset()"/>
    </div>
  </v-form>

  <v-dialog v-model="createProjectResponse" max-width="400">
    <v-card :title="projectResponseText" class="text-center">
      <div class="d-flex flex-row justify-center align-center mb-2">
        <Buttons name="Ok" prepend-icon="fa-regular fa-circle-xmark" class="mt-4 me-2" color="error" width=150 height=40 @click="createProjectResponse = false" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useProjectStore } from "@/stores/useProjectStore.vue";
  import InputField from "@/components/TemplateEngine/InputField.vue";
  import TextArea from "@/components/TemplateEngine/TextArea.vue";
  import Buttons from "@/components/TemplateEngine/Buttons.vue";

  const projectStore = useProjectStore();

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

  const createProjectResponse = ref(false);
  const projectResponseText = ref(null);

  // Ref for the form
  const form = ref(null);

  const createFormData = ref({
    title: '',
    description: '',
    redirectUrl: '',
    imageUrl: ''
  });

  // Method to validate the form
  async function validateAndSubmit() {
    if (form.value) {
      const { valid } = await form.value.validate();
      if (valid) {
        const response = await projectStore.createNewProject(createFormData);

        if (!response) {
          projectResponseText.value = 'Oops something went wrong!';
          createProjectResponse.value = true;
        } else {
          router.push({ path: '/superAdmin/project/list' });
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