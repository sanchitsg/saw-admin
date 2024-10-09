<template>
  <v-btn
    :type="type"
    :class="class"
    :color="color"
    :width="width"
    :height="height"
    >
    {{ name }}
  </v-btn>
</template>

<script setup>
  const props = defineProps({
    type: {
      type: String,
      required: false,
      default: "button"
    },
    name: {
        type: String,
        required: true,
        default: "Submit"
    },
    class: {
        type: String,
        required: true,
        default: "mt-4"
    },
    color: {
        type: String,
        required: true,
        default: "success"
    },
    width: {
        type: [String, Number],
        required: false,
        default: 400
    },
    height: {
        type: [String, Number],
        required: false,
        default: 50
    }
  })
</script>