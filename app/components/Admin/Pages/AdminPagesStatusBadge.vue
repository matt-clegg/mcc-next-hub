<script setup lang="ts">
defineProps<{
  page: AdminPage;
}>();
</script>

<template>
  <UBadge
    variant="soft"
    size="lg"
    :icon="page.status === 'published' ? 'i-lucide-eye' : 'i-lucide-eye-off'"
    :color="page.status === 'published' ? 'success' : 'secondary'"
  >
    {{ capitalize(page.status) }}
  </UBadge>
</template>

<style scoped>

</style>
