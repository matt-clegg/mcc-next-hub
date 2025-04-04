<script setup lang="ts">
import "quill/dist/quill.snow.css";
import { QuillEditor } from "@vueup/vue-quill";
import "~/assets/css/quill.css";

const content = defineModel<string | undefined>({ required: true });

withDefaults(defineProps<{
  contentType?: "html" | "text";
  placeholder?: string;
}>(), {
  contentType: "html"
});

const options = {
  modules: {
    toolbar: ["bold", "italic", "underline"]
  },
  theme: "snow"
};
</script>

<template>
  <QuillEditor
    v-model:content="content"
    :content-type="contentType"
    :options="options"
    :placeholder="placeholder"
  />
</template>

<style>
.ql-snow.ql-toolbar {
  border-color: var(--ui-border-accented);
  border-top-left-radius: calc(var(--ui-radius) * 1.5);
  border-top-right-radius: calc(var(--ui-radius) * 1.5);
}

.ql-snow.ql-container {
  border-color: var(--ui-border-accented);
  border-bottom-left-radius: calc(var(--ui-radius) * 1.5);
  border-bottom-right-radius: calc(var(--ui-radius) * 1.5);
  font: inherit;
}
</style>
