<template>
  <v-select
    :v-model="name"
    :class="class"
    :items="items"
    :rules="rules"
    :label="label"
    :required="required"
    :width="width"
  ></v-select>
</template>

<script setup>
  const props = defineProps({
    name: {
      type: String,
      required: true,
      default: "selectField"
    },
    class: {
      type: String,
      required: true,
      default: "ms-2"
    },
    items: {
      type: Array,
      required: true,
      default: [
        '-- Select One --',
      ]
    },
    rules: {
      type: Array,
      required: true,
      default: [v => !!v || 'Field is required!']
    },
    label: {
      type: String,
      required: true,
      default: "Select Field"
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