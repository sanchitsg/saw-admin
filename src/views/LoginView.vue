<template>
  <v-sheet
    class="pa-4 text-center mx-auto"
    elevation="12"
    max-width="600"
    rounded
    width="100%"
    color="#f8f8f2"
  >
    <v-icon
      class="my-5"
      color="#515d37"
      icon="fas fa-door-open"
      size="100"
    ></v-icon>
    <v-form ref="form" class="mx-auto my-5 w-75">
      <span class="text-body-2 my-3">Please login / signup to continue</span>
      <div class="d-flex flex-column">
        <InputField name="email" v-model="loginFormData.email" label="Email" class="mt-5" :rules="emailRules" required="true" width=400 />
        <InputField password=true name="password" v-model="loginFormData.password" label="Password" class="mb-5" :rules="passwordRules" required="true" width=400 />
      </div>
      <div class="d-flex justify-center align-center">
        <Buttons name="Login" prepend-icon="fas fa-arrows-rotate" class="mt-4 me-2" color="#515d37" width=200 height=50 @click="login" />
        <Buttons name="Register" prepend-icon="fas fa-arrows-rotate" class="mt-4" color="primary" width=200 height=50 @click="registerUser = true" />
      </div>
    </v-form>
  </v-sheet>
  <v-dialog v-model="registerUser" max-width="800">
    <v-card title="Create New User">
      <template v-slot:text>
        <v-form ref="registerForm" class="mx-auto">
          <div class="d-flex flex-row justify-space-around align-center">
            <InputField name="firstName" label="First Name" v-model="registerFormData.firstName" class="me-2" counter=30 :rules="nameRules" required="true" width=200 />
            <InputField name="lastName" label="Last Name" v-model="registerFormData.lastName" class="me-2" counter=30 :rules="nameRules" required="true" width=200 />
          </div>
          <div class="d-flex flex-row justify-space-around align-center">
            <InputField name="email" label="Email" v-model="registerFormData.email" class="me-2" counter=30 :rules="emailRules" required="true" width=200 />
            <InputField name="phone" label="Phone" class="me-2" counter=30 :rules="phoneRules" required="true" width=200 />
          </div>
          <div class="d-flex flex-row justify-space-around align-center">
            <InputField password="true" name="password" v-model="registerFormData.password" label="Password" hint="Atleast 10 characters." class="me-2" counter=10 :rules="passwordRules" required="true" width=200 />
            <InputField password="true" name="confirmPassword" label="Confirm Password" hint="Atleast 10 characters." class="me-2" counter=10 :rules="passwordRules" required="true" width=200 />
          </div>
          <div class="d-flex flex-row justify-center align-center">
            <Buttons name="Update" prepend-icon="fas fa-pen" class="mt-4 me-2" color="success" width=200 height=50 @click="register()" />
            <Buttons name="Cancel" prepend-icon="fa-regular fa-circle-xmark" class="mt-4 me-2" color="error" width=200 height=50 @click="registerUser = false" />
          </div>
        </v-form>
      </template>
    </v-card>
  </v-dialog>
  <v-dialog v-model="loginResponse" max-width="800">
    <v-card :title="loginResponseText" class="text-center">
      <div class="d-flex flex-row justify-center align-center mb-2">
        <Buttons name="Ok" prepend-icon="fa-regular fa-circle-xmark" class="mt-4 me-2" color="error" width=150 height=40 @click="loginResponse = false" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref } from 'vue';
  import { useAccountStore } from "@/stores/useAccountStore.vue";
  import { useRouter } from 'vue-router';
  import InputField from "@/components/TemplateEngine/InputField.vue";
  import Buttons from "@/components/TemplateEngine/Buttons.vue";

  const router = useRouter();
  
  const accountStore = useAccountStore();

  // Define reactive state variables using ref
  const nameRules = ref([
    v => !!v || 'Name is required',
    v => (v && v.length <= 30) || 'Name must be less than 30 characters',
  ]);
  const emailRules = ref([
    v => !!v || 'Email is required',
    v => (v && v.length <= 30) || 'Please enter valid email',
  ]);
  const phoneRules = ref([
    v => !!v || 'Email is required',
    v => (v && v.length <= 30) || 'Please enter valid email',
  ]);
  const passwordRules = ref([
    v => !!v || 'Password is required',
  ]);

  const loginResponse = ref(false);
  const loginResponseText = ref(null);
  const registerUser = ref(false);

  // Ref for the form
  const form = ref(null);
  const registerForm = ref(null);

  const loginFormData = ref({
    email: '',
    password: ''
  });

  const registerFormData = ref({
    firstName: '',
    lastName: '',
    email: '',
    groupId: 3
  });

  // Method to validate the form
  const login = async () => {
    if (form.value) {
      const { valid } = await form.value.validate();
      if (valid) {
        const response = await accountStore.login(loginFormData.value);

        if (!response) {
          loginResponseText.value = 'Login attempt failed! Please verify credentials and try again.';
          loginResponse.value = true;
        } else {
          router.push({ path: '/home' });
        }
      }
    }
  };

  const register = async () => {
    if (registerForm.value) {
      const { valid } = await registerForm.value.validate();
      if (valid) {
        const response = await accountStore.register(registerFormData.value);

        if (!response) {
          loginResponseText.value = 'User registration failed! Please verify and try again.';
          loginResponse.value = true;
        } else {
          registerUser.value = false;
          router.push({ path: '/home' });
        }
      }
    }
  };
</script>