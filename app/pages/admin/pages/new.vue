<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const route = useRoute();

const parent = ref<AdminPage>();

if (route.query.parent) {
  const { data, error } = await useFetch<Page>(`/api/admin/pages/${route.query.parent}`);

  if (error.value) {
    if (error.value.statusCode === 404) {
      throw showError({
        statusCode: 404,
        message: "Parent page not found"
      });
    }
    else {
      throw error.value;
    }
  }

  if (!data.value) {
    throw showError({
      statusCode: 404,
      message: "Parent page not found"
    });
  }

  parent.value = data.value;
}

const pageSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  content: z.string(),
  status: z.enum(["draft", "published"])
});

type PageSchema = z.output<typeof pageSchema>;

const loading = ref(false);

const page = reactive<Partial<PageSchema>>({
  title: "",
  content: "",
  status: "draft"
});

async function onSubmit(event: FormSubmitEvent<PageSchema>) {
  loading.value = true;
  try {
    const { id } = await $fetch("/api/pages", {
      method: "POST",
      body: {
        title: event.data.title,
        content: event.data.content,
        parent: parent.value?.id,
        status: event.data.status
      }
    });
    console.log("created page", id);
    await navigateTo("/admin/pages");
  }
  catch (error: any) {
    console.error("Error creating new page", error);
    loading.value = false;
  }
}
</script>

<template>
  <UPageCard
    title="New page"
    variant="naked"
  >
    <UPageCard>
      <AdminPagesForm
        title="New page"
        :schema="pageSchema"
        :state="page"
        :loading="loading"
        :parent="parent"
        @submit="onSubmit"
      />
    </UPageCard>
  </UPageCard>
</template>

<style scoped>

</style>
