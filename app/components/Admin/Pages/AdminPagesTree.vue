<script setup lang="ts">
defineProps<{
  pages: AdminPage[];
}>();

const open = ref(true);
</script>

<template>
  <div class="space-y-1">
    <div
      v-for="page in pages"
      :key="page.id"
      class="space-y-1"
    >
      <div class="flex items-center justify-between gap-1">
        <UButton
          class="font-medium text-sm text-(--ui-text-muted) hover:text-inherit w-full cursor-pointer truncate"
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-lucide-file-text"
          :to="`/admin/pages/edit/${page.id}`"
        >
          {{ page.title || "MISSING TITLE" }}
          <AdminPagesStatusBadge
            v-if="page.status === 'draft'"
            class="ml-1"
            :page="page"
            size="md"
          />
        </UButton>

        <div class="flex gap-1 items-center">
          <UButton
            v-if="page.children?.length"
            icon="i-lucide-chevron-down"
            size="sm"
            variant="ghost"
            color="neutral"
            :ui="{
              leadingIcon: [open ? 'rotate-180' : '', 'transition-transform duration-200']
            }"
            @click="open = !open"
          />
          <UButton
            icon="i-lucide-plus"
            size="sm"
            variant="soft"
            color="neutral"
            :to="`/admin/pages/new?parent=${page.id}`"
          />
        </div>
      </div>
      <template v-if="page.children?.length">
        <UCollapsible v-model:open="open">
          <template #content>
            <AdminPagesTree
              :pages="page.children"
              class="ml-4"
            />
          </template>
        </UCollapsible>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>
