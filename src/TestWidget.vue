<template>
  <h1>{{ $props.message }}</h1>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TestWidget",
  props: {
    message: {
      type: String,
      default: "Test Widget",
    },
  },
});
</script>
