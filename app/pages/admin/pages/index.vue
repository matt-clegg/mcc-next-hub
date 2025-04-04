<script setup lang="ts">
definePageMeta({
  layout: "admin"
  // middleware: "admin"
});

const { data: pages } = await useFetch<AdminPage[]>("/api/admin/pages");

const items = computed(() => {
  const result = pages.value?.map(mapToNavItem) ?? [];

  result.push({
    label: "Add new page",
    icon: "i-lucide-plus",
    to: "/admin/pages/new"
  });

  return result;
});

function mapToNavItem(page: Page) {
  const item = {
    label: page.title,
    icon: "i-lucide-file-text",
    to: `/admin/pages/edit/${page.id}`,
    defaultOpen: false,
    children: []
  };

  if (page.children) {
    item.defaultOpen = true;
    item.children = page.children.map(mapToNavItem);
  }

  return item;
}
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
    <!--    <UNavigationMenu -->
    <!--      orientation="vertical" -->
    <!--      :items="items" -->
    <!--    > -->
    <!--      <template #item-trailing="{ item }"> -->
    <!--        trailing -->
    <!--      </template> -->
    <!--    </UNavigationMenu> -->
  </UPageCard>
  <!--  <pre>{{ pages }}</pre> -->

  <!--    <LazyAdminPagesCreateModal v-model:open="newPageModalOpen" /> -->
</template>

<style scoped>

</style>
