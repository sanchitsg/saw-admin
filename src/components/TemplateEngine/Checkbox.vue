<template>
  <v-container fluid>
    <v-checkbox
      :label="label"
      :value="value"
      v-model="selectedData"
      :width="width"
    ></v-checkbox>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue';
  const props = defineProps({
    label: {
      type: [String, Number],
      required: true,
      default: 'Checkbox'
    },
    value: {
      type: [String, Number, Boolean],
      required: true,
      default: 'checkbox'
    },
    selected: {
      type: Array,
      required: false,
      default: []
    },
    width: {
      type: [String, Number],
      required: true,
      default: 400,
    }
  });

  const selectedData = ref(props.selected);
</script>