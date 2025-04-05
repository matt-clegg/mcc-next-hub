<script setup lang="ts">
import { Underline } from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import FileDownloadExtension from "./file-download-extension";
import { LazyRichTextLinkPickerModal } from "#components";

const content = defineModel<string>({ required: true });

function readContent() {
  try {
    return JSON.parse(content.value);
  }
  catch (err) {
    console.error("Error reading content:", err);
  }

  return "";
}

const editor = useEditor({
  content: content.value ? readContent() : "",
  extensions: [
    TiptapStarterKit,
    Underline,
    FileDownloadExtension,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        target: null,
        rel: null
      }
    })
  ],
  onUpdate: ({ editor }) => {
    content.value = JSON.stringify(editor.getJSON());
  }
});

// onMounted(() => {
//   editor.value?.commands.setContent(content.value);
// });

onBeforeUnmount(() => {
  unref(editor)?.destroy();
});

// const content = computed(() => editor.value?.getJSON());

const overlay = useOverlay();
const linkModal = overlay.create(LazyRichTextLinkPickerModal);

async function onLinkClick() {
  await linkModal.open({
    editor: editor.value
  });
}

function insertFileDownload() {
  editor.value
    .chain()
    .insertFileDownload({
      fileUrl: "https://example.com/file.pdf",
      fileType: "pdf",
      fileName: "file.pdf",
      fileSize: "100kb"
    });
}

type Button = {
  icon: string;
  tooltip?: string;
  disabled: () => boolean;
  active: () => boolean;
  click: () => void;
};

const buttons: Button[][] = [
  [
    {
      icon: "i-lucide-bold",
      tooltip: "Toggle bold",
      disabled: () => !(editor.value?.can().chain().focus().toggleBold().run() ?? true),
      active: () => editor.value?.isActive("bold") ?? false,
      click: () => editor.value?.chain().focus().toggleBold().run()
    },
    {
      icon: "i-lucide-italic",
      tooltip: "Toggle italic",
      disabled: () => !(editor.value?.can().chain().focus().toggleItalic().run() ?? true),
      active: () => editor.value?.isActive("italic") ?? false,
      click: () => editor.value?.chain().focus().toggleItalic().run()
    },
    {
      icon: "i-lucide-underline",
      tooltip: "Toggle underline",
      disabled: () => !(editor.value?.can().chain().focus().toggleUnderline().run() ?? true),
      active: () => editor.value?.isActive("underline") ?? false,
      click: () => editor.value?.chain().focus().toggleUnderline().run()
    },
    {
      icon: "i-lucide-strikethrough",
      tooltip: "Toggle strikethrough",
      disabled: () => !(editor.value?.can().chain().focus().toggleStrike().run() ?? true),
      active: () => editor.value?.isActive("strike") ?? false,
      click: () => editor.value?.chain().focus().toggleStrike().run()
    }
  ],
  [
    {
      icon: "i-lucide-list",
      tooltip: "Toggle unordered list",
      disabled: () => !(editor.value?.can().chain().focus().toggleBulletList().run() ?? true),
      active: () => editor.value?.isActive("bulletList") ?? false,
      click: () => editor.value?.chain().focus().toggleBulletList().run()
    },
    {
      icon: "i-lucide-list-ordered",
      tooltip: "Toggle ordered list",
      disabled: () => !(editor.value?.can().chain().focus().toggleOrderedList().run() ?? true),
      active: () => editor.value?.isActive("orderedList") ?? false,
      click: () => editor.value?.chain().focus().toggleOrderedList().run()
    }
  ],
  [
    {
      icon: "i-lucide-heading-2",
      disabled: () => !(editor.value?.can().toggleHeading({ level: 2 }) ?? true),
      active: () => editor.value?.isActive("heading", { level: 2 }) ?? false,
      click: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run()
    },
    {
      icon: "i-lucide-heading-3",
      disabled: () => !(editor.value?.can().toggleHeading({ level: 3 }) ?? true),
      active: () => editor.value?.isActive("heading", { level: 3 }) ?? false,
      click: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run()
    },
    {
      icon: "i-lucide-heading-4",
      disabled: () => !(editor.value?.can().toggleHeading({ level: 4 }) ?? true),
      active: () => editor.value?.isActive("heading", { level: 4 }) ?? false,
      click: () => editor.value?.chain().focus().toggleHeading({ level: 4 }).run()
    }
  ],
  [
    {
      icon: "i-lucide-link",
      tooltip: "Insert link",
      disabled: () => false,
      active: () => editor.value?.isActive("link") ?? false,
      click: onLinkClick
    },
    {
      icon: "i-lucide-unlink",
      tooltip: "Remove link",
      disabled: () => !(editor.value?.can().chain().focus().unsetLink().run() ?? true),
      active: () => false,
      click: () => editor.value?.chain().focus().unsetLink().run()
    }
  ]
];
</script>

<template>
  <div class="space-y-2">
    <div class="flex gap-2 flex-wrap">
      <template v-for="(buttonGroup, index) in buttons" :key="index">
        <div
          v-for="(button, buttonIndex) in buttonGroup"
          :key="buttonIndex"
        >
          <UTooltip
            v-if="button.tooltip"
            :text="button.tooltip"
            arrow
            :content="{
              side: 'top'
            }"
          >
            <UButton
              variant="ghost"
              color="neutral"
              active-variant="soft"
              :icon="button.icon"
              :disabled="button.disabled()"
              :active="button.active()"
              @click="button.click()"
            />
          </UTooltip>
          <UButton
            v-else
            variant="ghost"
            color="neutral"
            active-variant="soft"
            :icon="button.icon"
            :disabled="button.disabled()"
            :active="button.active()"
            @click="button.click()"
          />
        </div>

        <USeparator
          v-if="index < buttons.length - 1"
          orientation="vertical"
          class="h-auto"
        />
      </template>
    </div>

    <div class="flex ring ring-(--ui-border-accented) rounded-lg overflow-hidden">
      <div class="flex flex-grow min-h-[93px] max-h-[400px] justify-center overflow-auto">
        <div
          v-if="editor"
          class="prose prose-p:mt-2 flex-grow"
        >
          <TiptapEditorContent :editor="editor" />
        </div>
        <div v-else class="flex items-center justify-center flex-grow bg-(--ui-bg-accented)/20">
          <UIcon name="i-lucide-loader-circle" class="animate-spin size-6 text-(--ui-text-muted)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.tiptap {
  margin-top: .5rem;
  padding: .8rem;
  border-radius: .25rem;
}

.tiptap:focus-visible {
  outline: none;
}
</style>
