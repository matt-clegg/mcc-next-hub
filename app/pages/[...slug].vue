<script setup lang="ts">
import type { JSONContent } from "@tiptap/core";

const route = useRoute();
const slugs = route.params.slug;
const path = `/${Array.isArray(slugs) ? slugs?.join("/") : slugs}`;

const { data: page, error } = await useFetch<Page>(`/api/pages`, {
  query: {
    path
  }
});

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

useHead({
  title: page.value.title
});

const content = computed<JSONContent>(() => JSON.parse(page.value!.content) as JSONContent);
</script>

<template>
  <UContainer class="prose prose-p:mt-2 prose-li:m-0 max-w-3xl">
    <UPage>
      <UPageHeader :title="page!.title" />
      <UPageBody>
        <RichTextRenderer
          :data="content"
        />
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<style scoped>

</style>
