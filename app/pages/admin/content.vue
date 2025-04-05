<script setup lang="ts">
definePageMeta({
  layout: "admin"
});

const links = [[{
  label: "Pages",
  icon: "i-lucide-file-text",
  to: "/admin/content/pages"
},
{
  label: "Navigation",
  icon: "i-lucide-folder-tree",
  to: "/admin/content/navigation"
}
]];
</script>

<template>
  <UDashboardPanel id="pages" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Content">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>
