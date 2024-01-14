<template>
  <component :is="resolvedComponent"></component>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

// Define a ref to hold the resolved component
const resolvedComponent = ref(null);

onMounted(async () => {
  try {
    // Call the externalComponent function to load the component
    const component = await externalComponent("TestWidget.umd.min.js");
    resolvedComponent.value = component;
  } catch (error) {
    console.error(error);
  }
});

// External component loading function
async function externalComponent(url: string) {
  console.log(url);
  const name = url
    .split("/")
    .reverse()[0]
    .match(/^(.*?)\.umd/)[1];

  if (window[name]) return window[name];

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.addEventListener("load", () => {
      resolve(window[name]);
    });
    script.addEventListener("error", () => {
      reject(new Error(`Error loading ${url}`));
    });

    script.src = url;

    document.head.appendChild(script);
  });
}
</script>
