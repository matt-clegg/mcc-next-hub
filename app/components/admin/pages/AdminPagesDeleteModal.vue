<script setup lang="ts">
const props = defineProps<{
  pageId: string;
}>();

const { data: descendants } = await useFetch<Page[]>(`/api/admin/pages/${props.pageId}/descendants`);

const deleteLabel = computed(() => {
  const count = descendants.value?.length ?? 0;
  if (count) {
    return `Delete page and ${count} child ${count === 1 ? "page" : "pages"}`;
  }

  return "Delete page";
});

const emits = defineEmits<{ close: [boolean] }>();
const loading = ref(false);

async function onDelete() {
  loading.value = true;
  try {
    await $fetch(`/api/pages/${props.pageId}`, {
      method: "DELETE"
    });

    await navigateTo("/admin/pages");
    emits("close", true);
  }
  catch (error: any) {
    console.error("Error deleting page", error);
    loading.value = false;
  }
}
</script>

<template>
  <UModal
    title="Delete page"
  >
    <template #body>
      <div class="space-y-4">
        <UAlert
          color="error"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          title="This action cannot be undone"
          description="Are you sure you want to delete this page?"
        />

        <div
          v-if="descendants?.length"
          class="space-y-1"
        >
          <div>Deleting this page will also delete the following child pages:</div>
          <ul>
            <li
              v-for="page in descendants"
              :key="page.id"
              class="text-sm text-(--ui-text-muted)"
            >
              <ULink :to="page.url">
                {{ page.url }}
                <UIcon name="i-lucide-arrow-up-right" class="size-3 align-top text-(--ui-text-dimmed)" />
              </ULink>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #footer>
      <UButton
        color="neutral"
        label="Close"
        @click="emits('close', false)"
      />
      <UButton
        color="error"
        :label="deleteLabel"
        :loading="loading"
        @click="onDelete"
      />
    </template>
  </UModal>
</template>

<style scoped>

</style>
