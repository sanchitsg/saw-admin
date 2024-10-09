<template>
  <v-card class="mx-auto" max-width=500 color="#f8f8f2" rounded="50">
    <div class="d-flex flex-column flex-no-wrap justify-space-around align-center my-5">
      <v-avatar
        class="ma-3"
        rounded="50"
        size="125"
        icon="fas fa-pencil"
      >
        <v-img :src="accountStore.getUserImage"></v-img>
      </v-avatar>
      <div>
        <v-card-title class="text-h4 font-weight-bold text-center text-black">
          {{ accountStore.getName }}
        </v-card-title>
        <v-card-text class="text-body-2 text-center text-grey">
          {{ accountStore.getEmail }}
        </v-card-text>
        <v-card-subtitle class="text-body-1 text-center text-dark-grey">
          {{ accountStore.getUserGroup }}
        </v-card-subtitle>
      </div>
    </div>
  </v-card>
  <v-card min-width="900" max-width="1200" class="mx-auto" color="#f8f8f2" style="margin-top: 70px;">
    <div class="d-flex flex-column">
      <v-tabs
        v-model="tab"
        color="light-green-darken-4"
        direction="horizontal"
      >
        <v-tab prepend-icon="fas fa-user" text="Basic Info" value="basicInfo"></v-tab>
        <v-tab prepend-icon="fas fa-lock" text="Security" value="security"></v-tab>
        <v-tab prepend-icon="fas fa-bell" text="Notification" value="notify"></v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="basicInfo">
          <v-list lines="three" bg-color="transparent">
            <v-list-item
              v-for="(val, key) in basicInfoData"
              :key="key"
            >
              <v-list-item-title>{{ key }}</v-list-item-title>
              <v-list-item-subtitle>{{ val }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-tabs-window-item>

        <v-tabs-window-item value="security">
          <v-list lines="three" bg-color="transparent">
            <v-list-item
              v-for="([title, name, value], key) in securityInfoData"
              :key="key"
            >
              <v-list-item-title>{{ title }}</v-list-item-title>
              <div class="d-flex flex-row">
                <InputField v-if="name === 'email'" v-model="verifyData.email" :value="value" class="mt-1" counter=30 :rules="[]" required="true" width=400 />
                <InputField v-if="name === 'phone'" v-model="verifyData.phone" :value="value" class="mt-1" counter=30 :rules="[]" required="true" width=400 />
                <Buttons type="button" name="Verify" color="green-darken-3" class="mt-1" width="100" height="55" @click="verify(name)" />
              </div>
            </v-list-item>
          </v-list>
        </v-tabs-window-item>

        <v-tabs-window-item value="notify">
          <v-list lines="three" bg-color="transparent">
            <v-list-item
              v-for="([title, list, selected], i) in notifyInfoData"
              :key="i"
            >
              <div class="d-flex flex-row align-center">
                <div class="d-flex flex-column">
                  <v-list-item-title class="mb-3">{{ title }}</v-list-item-title>
                  <v-checkbox
                    v-model="notifyData['emailNotify']"
                    label="Email"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="notifyData['phoneNotify']"
                    label="Phone"
                  ></v-checkbox>
                </div>
                <Buttons type="button" name="Save" color="green-darken-3" class="ms-5" width="100" height="40" @click="notify()"/>
              </div>
            </v-list-item>
          </v-list>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue';
  import { useAccountStore } from "@/stores/useAccountStore.vue";
  import Buttons from "@/components/TemplateEngine/Buttons.vue";
  import InputField from "@/components/TemplateEngine/InputField.vue";

  const accountStore = useAccountStore();

  // Define reactive state variables using ref
  const tab = ref(null);
  const basicInfoData = accountStore.getUserInfo;
  const securityInfoData = accountStore.getSecurityInfo;
  const notifyInfoData = accountStore.getNotifyInfo;

  const verifyData = ref({
    email: accountStore.getEmail,
    phone: accountStore.getPhone
  });

  const notifyData = accountStore.getNotifyData;

  // Method to verify email/phone
  const verify = (field) => {
    const value = verifyData.value[field];
    if (field === 'email') {
      accountStore.updateUserEmail({email: value});
    } else {
      accountStore.updateUserPhone({phone: value});
    }
    router.go(0);
  };

  // Method to update User Notifications
  function notify() {
    accountStore.updateUserNotifications(notifyData);
    router.go(0);
  }
</script>