<script setup lang="ts">
import type { Editor } from "@tiptap/core";

const emits = defineEmits(["close"]);

const { editor } = defineProps<{
  editor: Editor;
}>();

const isNewLink = ref(false);

const linkUrl = ref(getLinkUrl());
const openInNewTab = ref(getOpenInNewTab());

function getLinkMark() {
  const { state } = editor;
  const { from } = state.selection;

  const node = state.doc.nodeAt(from);
  return node?.marks?.find(mark => mark.type.name === "link");
}

function getLinkUrl() {
  const linkMark = getLinkMark();
  const result = linkMark ? linkMark.attrs.href : "";
  isNewLink.value = result === "";
  return result;
}

function getOpenInNewTab() {
  const linkMark = getLinkMark();
  return linkMark ? linkMark.attrs.target === "_blank" : false;
}

const config = useRuntimeConfig();
const internalUrl = config.public.baseUrl;

const linkUnsecure = computed(() => linkUrl.value.startsWith("http://") && !linkUrl.value.startsWith("http://localhost"));
const linkIsInternalDomain = computed(() => linkUrl.value.startsWith(internalUrl));

function onSave() {
  let link = linkUrl.value;

  if (!link) {
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .unsetLink()
      .run();

    emits("close");
    return;
  }

  if (linkIsInternalDomain.value) {
    link = link.replace(internalUrl, "");
  }

  editor
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({
      href: link,
      target: openInNewTab.value ? "_blank" : undefined
      // rel: link.startsWith("http://") || link.startsWith("https://") || link.startsWith("//")
      //   ? "noopener noreferrer"
      //   : undefined
    })
    .run();

  emits("close");
}
</script>

<template>
  <UModal :title="isNewLink ? 'New link' : 'Edit link'">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Link">
          <UInput v-model="linkUrl" placeholder="https://google.co.uk" class="w-full" />
        </UFormField>
        <USwitch v-model="openInNewTab" label="Open in new tab" />
        <UAlert
          v-if="linkUnsecure"
          title="Unsecure link"
          description="The link you've entered is not secure, we recommend using https:// links."
          color="error"
          icon="i-lucide-triangle-alert"
          variant="subtle"
        />
      </div>
    </template>
    <template #footer>
      <UButton color="neutral" label="Cancel" @click="emits('close')" />
      <UButton label="Save" @click="onSave" />
    </template>
  </UModal>
</template>

<style scoped>

</style>
