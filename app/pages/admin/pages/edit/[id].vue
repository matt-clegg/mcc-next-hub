<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { LazyAdminPagesDeleteModal } from "#components";

const route = useRoute();
const id = route.params.id as string;

const { data: page, error } = await useFetch<AdminPage>(`/api/admin/pages/${id}`);

if (error.value) {
  if (error.value.statusCode === 404) {
    throw showError({
      statusCode: 404,
      message: "Page not found"
    });
  }
  else {
    throw error.value;
  }
}

if (!page.value) {
  throw showError({
    statusCode: 404,
    message: "Page not found"
  });
}

const state = reactive<AdminPage>({ ...page.value });

const pageSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  content: z.string(),
  status: z.enum(["draft", "published"])
});

type PageSchema = z.output<typeof pageSchema>;

const loading = ref(false);

async function onSubmit(event: FormSubmitEvent<PageSchema>) {
  loading.value = true;
  try {
    await $fetch(`/api/pages/${id}`, {
      method: "PUT",
      body: {
        title: event.data.title,
        content: event.data.content,
        status: event.data.status
      }
    });

    await navigateTo("/admin/pages");
  }
  catch (error: any) {
    console.error("Error editing page", error);
    loading.value = false;
  }
}

const overlay = useOverlay();
const modal = overlay.create(LazyAdminPagesDeleteModal, {
  props: {
    pageId: id
  }
});

const deleteLoading = ref(false);

async function onTryDelete() {
  deleteLoading.value = true;
  try {
    await modal.open();
  }
  finally {
    deleteLoading.value = false;
  }
}
</script>

<template>
  <UPageCard
    variant="naked"
    :ui="{
      header: 'mb-0'
    }"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <div class="text-base text-pretty font-semibold text-(--ui-text-highlighted)">
          Edit page
        </div>
        <AdminPagesStatusBadge :page="page!" />
      </div>
    </template>
    <UPageCard
      :ui="{
        root: 'ring-0 md:ring',
        container: 'p-0 sm:p-0 md:p-6'
      }"
    >
      <AdminPagesForm
        title="Edit page"
        :schema="pageSchema"
        :state="state"
        :loading="loading"
        :parent="page!.parent"
        @submit="onSubmit"
      />
    </UPageCard>
    <UPageCard
      class="bg-gradient-to-tl from-(--ui-error)/10 from-5% to-(--ui-bg)"
      title="Danger zone"
      description="Deleting a page is permanent and cannot be undone. It will also remove all child pages."
    >
      <template #footer>
        <UButton
          label="Delete page"
          color="error"
          :loading="deleteLoading"
          @click="onTryDelete"
        />
      </template>
    </UPageCard>
  </UPageCard>
</template>

<style scoped>

</style>
