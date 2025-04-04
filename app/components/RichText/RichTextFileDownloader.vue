<script setup lang="ts">
import { NodeViewWrapper } from "@tiptap/vue-3";

const props = defineProps<{
  fileUrl: string;
  fileType: string;
  fileName: string;
  fileSize: string;
}>();

const fileIcon = computed(() => {
  const type = props.fileType;

  switch (type) {
    case "jpg":
    case "jpeg":
    case "png":
    case "webp":
    case "gif":
      return "i-lucide-file-image";
    case "pdf":
      return "i-lucide-file-text";
    case "zip":
      return "i-lucide-file-archive";
    default:
      return "i-lucide-file";
  }
});
</script>

<template>
  <NodeViewWrapper>
    <a
      class="ring ring-gray-200 p-4 flex justify-between items-center gap-2 rounded-md no-underline bg-gray-50"
      :href="fileUrl"
    >
      <UIcon :name="fileIcon" class="size-7" />
      <div class="flex flex-col text-sm flex-grow">
        <span class="font-semibold">{{ fileName }}</span>
        <span class="text-(--ui-text-muted) text-xs">{{ fileSize }}</span>
      </div>
      <UIcon name="i-lucide-download" class="size-7" />
    </a>
  </NodeViewWrapper>
</template>

<style scoped>

</style>
