<script lang="ts">
  import { defineStore } from 'pinia';
  import axios from 'axios';
  import type { ProjectInfo } from "./Interfaces/projectInfo";
  import { useAccountStore } from "./useAccountStore.vue";

  export const useProjectStore = defineStore('projects', {
    state: () => {
      return {
        projectsList: [] as ProjectInfo[],
      }
    },
    getters: {
      getProjectsList: (state) => state.projectsList,
    },
    actions: {
      async fetchProjectsList() {
        const accountStore = useAccountStore();
        const bearer = accountStore.getAuthToken;

        const response = await axios.get(
          'http://localhost:8070/projects',
          {
            headers: {
              "Authorization": `Bearer ` + bearer,
              "Content-Type": `application/json`
            }
          }
        );

        this.projectsList = response.data;
      },
      async updateProjectsListInfo(data) {
        try {
          const accountStore = useAccountStore();
          const bearer = accountStore.getAuthToken;

          const response = await axios.put(
            'http://localhost:8070/projects',
            {
              id: data.value['id'] ?? 0,
              title: data.value['title'] ?? '',
              description: data.value['description'] ?? '',
              redirectUrl: data.value['redirectUrl'] ?? '',
              imageUrl: data.value['imageUrl'] ?? ''
            },
            {
              headers: {
                "Authorization": `Bearer ` + bearer,
                "Content-Type": `application/json`
              }
            }
          );

          const updatedProject = response.data;

          this.$patch((state) => {
            if (state.projectsList) {
              state.projectsList = state.projectsList.map((project) => {
                if (project.id === updatedProject.id) {
                  return { ...project, ...updatedProject };
                }
                return project;
              });
            }
          });
        } catch (error) {
          console.error('Error updating project info:  ', error);
        }
      },
      async createNewProject(data) {
        try {
          const accountStore = useAccountStore();
          const bearer = accountStore.getAuthToken;

          const response = await axios.post(
            'http://localhost:8070/projects',
            {
              title: data.value['title'] ?? '',
              description: data.value['description'] ?? '',
              redirect_url: data.value['redirectUrl'] ?? '',
              imageUrl: data.value['imageUrl'] ?? ''
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
          console.error('Error creating project: ', error);
          return false;
        }
      },
      async deleteProject(projectId) {
        try {
          const accountStore = useAccountStore();
          const bearer = accountStore.getAuthToken;

          const response = await axios.delete(
            'http://localhost:8070/projects/' + projectId,
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
          console.error('Error deleting project: ', error);
          return false;
        }
      },
    },
  });
</script>