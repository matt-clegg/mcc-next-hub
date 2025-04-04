<script setup lang="ts">
import { Underline } from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import FileDownloadExtension from "./file-download-extension";
import { LazyRichTextLinkPickerModal } from "#components";

const content = defineModel<string>({ required: true });

const editor = useEditor({
  content: content.value ? JSON.parse(content.value) : "",
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
</script>

<template>
  <div>
    <div v-if="editor">
      <div class="flex gap-2">
        <div>
          <UButton
            variant="ghost"
            color="neutral"
            active-variant="soft"
            icon="i-lucide-bold"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :active="editor.isActive('bold')"
            @click="editor.chain().focus().toggleBold().run()"
          />

          <UButton
            variant="ghost"
            color="neutral"
            active-variant="soft"
            icon="i-lucide-italic"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :active="editor.isActive('italic')"
            @click="editor.chain().focus().toggleItalic().run()"
          />

          <UButton
            variant="ghost"
            color="neutral"
            active-variant="soft"
            icon="i-lucide-underline"
            :disabled="!editor.can().chain().focus().toggleUnderline().run()"
            :active="editor.isActive('underline')"
            @click="editor.chain().focus().toggleUnderline().run()"
          />

          <UButton
            variant="ghost"
            color="neutral"
            active-variant="soft"
            icon="i-lucide-strikethrough"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :active="editor.isActive('strike')"
            @click="editor.chain().focus().toggleStrike().run()"
          />

          <UButton
            variant="ghost"
            color="neutral"
            active-variant="soft"
            icon="i-lucide-link"
            :active="editor.isActive('link')"
            @click="onLinkClick"
          />
        </div>

        <USeparator
          orientation="vertical"
          class="h-auto"
        />

        <div>
          <UButton
            variant="ghost"
            color="neutral"
            active-variant="soft"
            icon="i-lucide-heading-1"
            :disabled="!editor.can().toggleHeading({ level: 1 })"
            :active="editor.isActive('heading', { level: 1 })"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          />
          <UButton
            variant="ghost"
            color="neutral"
            active-variant="soft"
            icon="i-lucide-heading-2"
            :disabled="!editor.can().toggleHeading({ level: 2 })"
            :active="editor.isActive('heading', { level: 2 })"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          />
          <UButton
            variant="ghost"
            color="neutral"
            active-variant="soft"
            icon="i-lucide-heading-3"
            :disabled="!editor.can().toggleHeading({ level: 3 })"
            :active="editor.isActive('heading', { level: 3 })"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          />
        </div>

        <USeparator
          orientation="vertical"
          class="h-auto"
        />

        <div>
          <UButton
            variant="ghost"
            color="neutral"
            active-variant="soft"
            icon="i-lucide-file-down"
            :disabled="!editor.can().toggleHeading({ level: 3 })"
            :active="editor.isActive('heading', { level: 3 })"
            @click="insertFileDownload"
          />
        </div>
      </div>
      <!--      <UButton -->
      <!--        :disabled="!editor.can().chain().focus().toggleCode().run()" -->
      <!--        :class="{ 'is-active': editor.isActive('code') }" -->
      <!--        @click="editor.chain().focus().toggleCode().run()" -->
      <!--      > -->
      <!--        code -->
      <!--      </UButton> -->
      <!--      <UButton @click="editor.chain().focus().unsetAllMarks().run()"> -->
      <!--        clear marks -->
      <!--      </UButton> -->
      <!--      <UButton @click="editor.chain().focus().clearNodes().run()"> -->
      <!--        clear nodes -->
      <!--      </UButton> -->
      <!--      <UButton -->
      <!--        :class="{ 'is-active': editor.isActive('paragraph') }" -->
      <!--        @click="editor.chain().focus().setParagraph().run()" -->
      <!--      > -->
      <!--        paragraph -->
      <!--      </UButton> -->
      <!--      <UButton -->
      <!--        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" -->
      <!--        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" -->
      <!--      > -->
      <!--        h1 -->
      <!--      </UButton> -->
      <!--      <UButton -->
      <!--        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" -->
      <!--        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" -->
      <!--      > -->
      <!--        h2 -->
      <!--      </UButton> -->
      <!--      <UButton -->
      <!--        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" -->
      <!--        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" -->
      <!--      > -->
      <!--        h3 -->
      <!--      </UButton> -->
      <!--      <UButton -->
      <!--        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }" -->
      <!--        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" -->
      <!--      > -->
      <!--        h4 -->
      <!--      </UButton> -->
      <!--      <UButton -->
      <!--        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }" -->
      <!--        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" -->
      <!--      > -->
      <!--        h5 -->
      <!--      </UButton> -->
      <!--      <UButton -->
      <!--        :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }" -->
      <!--        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" -->
      <!--      > -->
      <!--        h6 -->
      <!--      </UButton> -->
      <!--      <UButton -->
      <!--        :class="{ 'is-active': editor.isActive('bulletList') }" -->
      <!--        @click="editor.chain().focus().toggleBulletList().run()" -->
      <!--      > -->
      <!--        bullet list -->
      <!--      </UButton> -->
      <!--      <UButton -->
      <!--        :class="{ 'is-active': editor.isActive('orderedList') }" -->
      <!--        @click="editor.chain().focus().toggleOrderedList().run()" -->
      <!--      > -->
      <!--        ordered list -->
      <!--      </UButton> -->
      <!--      <UButton -->
      <!--        :class="{ 'is-active': editor.isActive('codeBlock') }" -->
      <!--        @click="editor.chain().focus().toggleCodeBlock().run()" -->
      <!--      > -->
      <!--        code block -->
      <!--      </UButton> -->
      <!--      <UButton -->
      <!--        :class="{ 'is-active': editor.isActive('blockquote') }" -->
      <!--        @click="editor.chain().focus().toggleBlockquote().run()" -->
      <!--      > -->
      <!--        blockquote -->
      <!--      </UButton> -->
      <!--      <UButton @click="editor.chain().focus().setHorizontalRule().run()"> -->
      <!--        horizontal rule -->
      <!--      </UButton> -->
      <!--      <UButton @click="editor.chain().focus().setHardBreak().run()"> -->
      <!--        hard break -->
      <!--      </UButton> -->
      <!--      <UButton -->
      <!--        :disabled="!editor.can().chain().focus().undo().run()" -->
      <!--        @click="editor.chain().focus().undo().run()" -->
      <!--      > -->
      <!--        undo -->
      <!--      </UButton> -->
      <!--      <UButton -->
      <!--        :disabled="!editor.can().chain().focus().redo().run()" -->
      <!--        @click="editor.chain().focus().redo().run()" -->
      <!--      > -->
      <!--        redo -->
      <!--      </UButton> -->
    </div>
    <div class="prose">
      <TiptapEditorContent :editor="editor" />
    </div>

    <pre>{{ content }}</pre>
  </div>
</template>

<style>
.tiptap {
  margin-top: .5rem;
  padding: .8rem;
  border-radius: .25rem;
}
</style>
