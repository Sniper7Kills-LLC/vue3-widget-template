<template>
  <component :is="resolvedComponent" v-bind="settings"></component>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

// Define a ref to hold the resolved component
const resolvedComponent = ref(null);

const settings = ref({ message: "Custom Message" });

onMounted(async () => {
  try {
    // Call the externalComponent function to load the component
    const component = await externalComponent(
      "https://gist.githack.com/sniper7kills/6b42ba3125724c5709f604e90379e18f/raw/0f0a9c529cbfb00688eee0546958a106c036273c/TestWidget.umd.min.js"
    );
    resolvedComponent.value = component;
  } catch (error) {
    console.error("Error loading external component:", error);
  }
});

// External component loading function
async function loadScript(url: string, name: string) {
  if (window[name]) return window[name];

  const timestamp = new Date().getTime();
  const scriptUrl = `${url}?t=${timestamp}`;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.addEventListener("load", () => {
      resolve(window[name]);
    });
    script.addEventListener("error", () => {
      reject(new Error(`Error loading ${scriptUrl}`));
    });

    script.src = scriptUrl;

    document.head.appendChild(script);
  });
}

async function externalComponent(url: string) {
  const matchResult = url
    .split("/")
    .reverse()[0]
    .match(/^(.*?)\.umd/);
  const name = matchResult ? matchResult[1] : null;

  if (!name) {
    console.error(`Error: Unable to extract name from URL ${url}`);
    return null;
  }

  return loadScript(url, name);
}
</script>
