<template>
  <v-text-field
    :type="type"
    :append-inner-icon="appendIcon"
    :class="class"
    :counter="counter"
    :rules="rules"
    :label="label"
    :hint="hint"
    :required="required"
    :disabled="disabled"
    :width="width"
    @click:append-inner="hideShow"
  ></v-text-field>
</template>

<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    class: {
      type: String,
      required: true,
      default: "me-2"
    },
    counter: {
      type: [String, Number],
      required: false,
      default: 100
    },
    password: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    rules: {
      type: Array,
      required: true,
      default: [v => !!v || 'Field is required!']
    },
    label: {
      type: String,
      required: false
    },
    hint: {
      type: String,
      required: false
    },
    value: {
      type: [String, Number],
      required: false
    },
    required: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    disabled: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    width: {
      type: [String, Number],
      required: false,
      default: 400
    }
  })

  const type = props.password ? ref("password") : ref("text");
  const show = ref(false);

  const appendIcon = type.value === "password" ? ref("fas fa-eye-slash") : "";

  function hideShow() {
    if (type.value === "password") {
      show.value = true;
      appendIcon.value = "fas fa-eye";
      type.value = "text";
    } else {
      show.value = false;
      appendIcon.value = "fas fa-eye-slash";
      type.value = "password";
    }
  }
</script>