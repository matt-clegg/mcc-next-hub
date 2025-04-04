<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} - MCC Next` : "MCC Next",
  htmlAttrs: {
    lang: "en"
  }
});
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
