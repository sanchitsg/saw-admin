<template> 
  <v-form ref="form" class="mx-auto my-3 w-75">
    <div class="d-flex flex-row justify-space-around align-center">
      <InputField name="firstName" v-model="createFormData.firstName" label="First Name" class="me-2" counter=30 :rules="nameRules" required="true" width=200 />
      <InputField name="lastName" v-model="createFormData.lastName" label="Last Name" class="me-2" counter=30 :rules="nameRules" required="true" width=200 />
    </div>
    <div class="d-flex flex-row justify-space-around align-center">
      <InputField name="email" v-model="createFormData.email" label="Email" class="me-2" :rules="emailRules" required="true" width=200 />
      <RadioGroup name="userGroup" v-model="createFormData.group" heading="Select One User Group" :list="group" width=200 />
    </div>
    <div class="d-flex flex-row justify-space-around align-center">
      <InputField password=true name="password" v-model="createFormData.password" label="Password" hint="Atleast 10 characters." class="me-2" counter=10 :rules="passwordRules" required="true" width=200 />
      <InputField password=true name="confirmPassword" label="Confirm Password" hint="Atleast 10 characters." class="me-2" counter=10 :rules="passwordRules" required="true" width=200 />
    </div>
    <div class="d-flex flex-row justify-space-around align-center">
      <TextArea name="about" label="About" width=270 />
      <RadioGroup name="notification" heading="How would you prefer to be notified?" :list="notifyList" width=200 />
    </div>
    <div class="d-flex justify-center align-center">
      <Buttons name="Submit" prepend-icon="fas fa-arrows-rotate" class="mt-4 me-2" color="success" width=200 height=50 @click="validateAndSubmit()"/>
      <Buttons name="Reset" prepend-icon="fas fa-arrows-rotate" class="mt-4" color="error" width=200 height=50 @click="reset()"/>
    </div>
  </v-form>

  <v-dialog v-model="createUserResponse" max-width="400">
    <v-card :title="userResponseText" class="text-center">
      <div class="d-flex flex-row justify-center align-center mb-2">
        <Buttons name="Ok" prepend-icon="fa-regular fa-circle-xmark" class="mt-4 me-2" color="error" width=150 height=40 @click="createUserResponse = false" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from "@/stores/useUserStore.vue";
  import InputField from "@/components/TemplateEngine/InputField.vue";
  import SelectBox from "@/components/TemplateEngine/SelectBox.vue";
  import TextArea from "@/components/TemplateEngine/TextArea.vue";
  import RadioGroup from "@/components/TemplateEngine/RadioGroup.vue";
  import Buttons from "@/components/TemplateEngine/Buttons.vue";

  const userStore = useUserStore();

  const router = useRouter();

  // Define reactive state variables using ref
  const nameRules = ref([
    v => !!v || 'Name is required',
    v => (v && v.length <= 30) || 'Name must be less than 30 characters',
  ]);
  const emailRules = ref([
    v => !!v || 'Email is required',
    v => (v && v.length <= 30) || 'Please enter valid email',
  ]);
  const passwordRules = ref([
    v => !!v || 'Password is required',
    v => (v && v.length <= 10) || 'Password must be less than 10 characters',
  ]);
  const group = ref([
    ['Administrator', 2],
    ['Guest', 3],
  ]);
  const notifyList = ref([
    ["Via Email", "emailNotify"],
    ["Via SMS", "smsNotify"],
    ["Both", "both"],
    ['None', 'none'],
  ]);

  const createUserResponse = ref(false);
  const userResponseText = ref(null);

  // Ref for the form
  const form = ref(null);

  const createFormData = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    group: ''
  });

  // Method to validate the form
  async function validateAndSubmit() {
    if (form.value) {
      const { valid } = await form.value.validate();
      if (valid) {
        const response = await userStore.createNewUser(createFormData);

        if (!response) {
          userResponseText.value = 'Oops something went wrong!';
          createUserResponse.value = true;
        } else {
          router.push({ path: '/superAdmin/user/list' });
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