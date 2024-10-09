<template>
  <v-radio-group v-model="radioGroup" :width="width">
    <template v-slot:label>
      <div>{{ heading }}</div>
    </template>
    <v-radio
      v-for="([label, value], l) in list"
      :key="l"
      :label="label"
      :value="value"
    ></v-radio>
    </v-radio-group>
</template>

<script setup>
  import { ref, watch } from 'vue';
  const props = defineProps({
    name: {
      type: String,
      required: true,
      default: "radioGroup",
    },
    heading: {
      type: String,
      required: false,
      default: "Please select atleast one option",
    },
    list: {
      type: Array,
      required: true,
      default: [
        ['None', 'none'],
      ]
    },
    selected: {
      type: [Number, String],
      required: false,
    },
    width: {
      type: [String, Number],
      required: true,
      default: 400,
    }
  });

  const radioGroup = ref(props.selected);

  watch(() => props.selected, (newValue) => {
    radioGroup.value = newValue;
  });
</script>