<template>
  <v-textarea
    :v-model="name"
    :label="label"
    variant="filled"
    :width="width"
    rows="1"
    no-resize
  ></v-textarea>
</template>
  
  <script setup>
    const props = defineProps({
      name: {
          type: String,
          required: true,
          default: "textArea"
      },
      label: {
          type: String,
          required: true,
          default: "Text Area"
      },
      required: {
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
  </script>