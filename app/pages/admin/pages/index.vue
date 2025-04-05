<script setup lang="ts">
definePageMeta({
  layout: "admin"
  // middleware: "admin"
});

const { data: pages } = await useFetch<AdminPage[]>("/api/admin/pages");
</script>

<template>
  <UPageCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex flex-col gap-1">
          <div class="text-base text-pretty font-semibold text-(--ui-text-highlighted)">
            Pages
          </div>
          <span
            v-if="pages?.length"
            class="text-sm"
          >Click the plus icon to add a new child page</span>
        </div>
        <UButton
          to="/admin/pages/new"
          color="neutral"
          variant="soft"
          icon="i-lucide-plus"
          class="w-fit lg:ms-auto"
        >
          Add new page
        </UButton>
      </div>
    </template>
    <AdminPagesTree
      v-if="pages?.length"
      :pages="pages"
      class="w-full"
    />
    <div
      v-else
      class="flex justify-center items-center flex-col gap-2 py-10"
    >
      <UIcon name="i-lucide-file-question" class="size-10 text-(--ui-text-muted)/50" />
      <span class="text-(--ui-text-muted)">
        No pages yet, why not add one?
      </span>
    </div>
  </UPageCard>
</template>

<style scoped>

</style>
