<template>
  <v-data-table
    :headers="headers"
    :items="projects"
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

  <v-dialog v-model="updateProjectInfo" max-width="800">
    <v-card title="Update Project Info">
      <template v-slot:text>
        <v-form ref="form" class="mx-auto">
          <div class="d-flex flex-row justify-space-around align-center">
            <InputField name="title" v-model="updateFormData.title" :value="updateFormData.title" class="me-2" counter=30 :rules="nameRules" required="true" width=200 />
            <TextArea name="description" v-model="updateFormData.description" :value="updateFormData.description" label="Project Description" width=200 />
          </div>
          <div class="d-flex flex-row justify-space-around align-center">
            <InputField name="redirectUrl" v-model="updateFormData.redirectUrl" :value="updateFormData.redirectUrl" class="me-2" counter=30 :rules="urlRules" required="true" width=200 />
            <InputField name="imageUrl" v-model="updateFormData.imageUrl" :value="updateFormData.imageUrl" class="me-2" counter=30 :rules="urlRules" required="true" width=200 />
          </div>
          <div class="d-flex flex-row justify-center align-center">
            <Buttons name="Update" prepend-icon="fas fa-pen" class="mt-4 me-2" color="success" width=200 height=50 @click="confirmUpdate = true" />
            <Buttons name="Cancel" prepend-icon="fa-regular fa-circle-xmark" class="mt-4 me-2" color="error" width=200 height=50 @click="updateProjectInfo = false" />
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
    <v-card title="Unable to delete this project! Please try again." class="text-center">
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
  import TextArea from "@/components/TemplateEngine/TextArea.vue";
  import Buttons from "@/components/TemplateEngine/Buttons.vue";
  import { useProjectStore } from "@/stores/useProjectStore.vue";

  const projectStore = useProjectStore();
  await projectStore.fetchProjectsList();

  const router = useRouter();

  const headers = ref([
    { title: 'Id', align: 'center', value: 'id', sortable: true },
    { title: 'Title', align: 'center', value: 'title', sortable: true },
    { title: 'Description', align: 'center', value: 'description', sortable: false },
    { title: 'Redirect URL', align: 'center', value: 'redirect_url', sortable: false },
    { title: 'Image URL', align: 'center', value: 'image_url', sortable: false },
    { title: 'Actions', align: 'center', key: 'actions', sortable: false },
  ]);
  const projects = projectStore.getProjectsList;

  const updateProjectInfo = ref(false);
  const confirmUpdate = ref(false);
  const deleteError = ref(false);

  const updateFormData = ref({
    id: 0,
    title: '',
    description: '',
    redirectUrl: '',
    imageUrl: ''
  });
  const nameRules = ref([
    v => !!v || 'Name is required',
    v => (v && v.length <= 30) || 'Name must be less than 30 characters',
  ]);
  const urlRules = ref([
    v => !!v || 'URL is required',
    v => (v && v.length <= 100) || 'URL must be less than 100 characters',
  ]);

  function editItem(projectData) {
    updateFormData.value['id'] = projectData.id;
    updateFormData.value['title'] = projectData.title;
    updateFormData.value['description'] = projectData.description;
    updateFormData.value['redirectUrl'] = projectData.redirect_url;
    updateFormData.value['imageUrl'] = projectData.image_url;
    updateProjectInfo.value = true;
  }

  async function confirmEdit() {
    await projectStore.updateProjectsListInfo(updateFormData);
    projects.value = projectStore.getProjectsList;
    confirmUpdate.value = false;
    updateProjectInfo.value = false;
    router.go(0);
  }

  function cancelEdit() {
    confirmUpdate.value = false;
    updateProjectInfo.value = false;
  }

  async function deleteItem(projectId) {
    const response = await projectStore.deleteProject(projectId);

    if (response) {
      router.go(0);
    } else {
      deleteError.value = true;
    }
  }
</script>