<template>
  <div>
    <p>Example Widget</p>
    <label>Prop "message":</label>
    <span>{{ $props.message }}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ExampleWidget",
  widgetWidth: 3,
  props: {
    message: {
      type: String,
      default: "Test Widget",
    },
  },
});
</script>
