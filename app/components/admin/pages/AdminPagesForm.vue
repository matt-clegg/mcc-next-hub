<script setup lang="ts" generic="T extends Partial<AdminPage>">
import type { FormSubmitEvent } from "#ui/types";
import { ULink, LazyModalConfirm } from "#components";

const props = defineProps<{
  title: string;
  schema: unknown;
  state: T;
  loading: boolean;
  parent?: AdminPage | null;
}>();

const emits = defineEmits<{
  submit: [FormSubmitEvent<any>];
}>();

const formRef = ref();
const state = reactive<T>({
  ...props.state
});

const initialStatus = ref(props.state.status);
const isNewPage = computed(() => !props.state.id);

const pageUrl = computed(() => {
  const newSlug = state.title ? slugify(state.title) : "";

  if (props.parent) {
    return `${props.parent.url}/${newSlug}`;
  }
  else {
    return `/${newSlug}`;
  }
});

function onSubmit(event: FormSubmitEvent<any>) {
  if (!urlValid.value) {
    return;
  }

  emits("submit", event);
}

const lastCheckedUrl = ref();
const urlValid = ref(true);

const router = useRouter();

async function onTitleBlur() {
  if (pageUrl.value === lastCheckedUrl.value) {
    return;
  }

  try {
    if (state.title && pageUrl.value) {
      if (router.getRoutes().some(route => route.path === pageUrl.value)) {
        return;
      }

      urlValid.value = await $fetch<boolean>("/api/admin/pages/check-url", {
        query: {
          url: pageUrl.value
        }
      });
    }
  }
  catch (error: any) {
    console.error("Error checking for valid page url", error);
  }

  lastCheckedUrl.value = pageUrl.value;
}

const overlay = useOverlay();
const confirmDraftModal = overlay.create(LazyModalConfirm, {
  props: {
    title: "Unpublish page?",
    bodyText: "Once unpublished, visitors will no longer have access and will see a 404 page. Are you sure you want to proceed?",
    okLabel: "Yes, unpublish"
  }
});

const confirmPublishModal = overlay.create(LazyModalConfirm, {
  props: {
    title: "Publish Page?",
    bodyText: "Publishing this page will make it publicly visible to all visitors. Are you sure you want to proceed?",
    okLabel: "Yes, publish"
  }
});

async function saveAsDraft() {
  if (!isNewPage.value && state.status === "published") {
    const result = await confirmDraftModal.open();
    if (!result) {
      return;
    }
  }

  state.status = "draft";
  formRef.value.submit();
}

async function saveAsPublished() {
  if (!isNewPage.value && state.status === "draft") {
    const result = await confirmPublishModal.open();
    if (!result) {
      return;
    }
  }

  state.status = "published";
  formRef.value.submit();
}
</script>

<template>
  <UForm
    ref="formRef"
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      name="title"
      label="Title"
      required
    >
      <UInput
        v-model="state.title"
        class="w-full"
        @blur="onTitleBlur"
      />
    </UFormField>

    <UFormField
      label="Page url"
      :error="urlValid ? undefined : 'This url is already in use, please change the page title.'"
    >
      <component
        :is="isNewPage ? 'span' : ULink"
        :to="pageUrl"
        target="_blank"
        class="bg-(--ui-bg-elevated)/50 w-full block px-2.5 py-1.5 text-sm text-(--ui-text-highlighted) rounded-[calc(var(--ui-radius)*1.5)]"
      >
        {{ pageUrl }}
        <UIcon
          v-if="!isNewPage"
          name="i-lucide-arrow-up-right"
          class="size-3 align-top text-(--ui-text-dimmed)"
        />
      </component>
    </UFormField>

    <UFormField
      name="content"
      label="Content"
      required
    >
      <RichTextEditorTiptap
        v-model="state.content!"
      />
    </UFormField>

    <div class="flex gap-3 flex-col sm:flex-row pt-3">
      <UButton
        color="neutral"
        class="w-full sm:w-auto flex items-center justify-center"
        :icon="initialStatus === 'published' ? 'i-lucide-eye-off' : 'i-lucide-save'"
        :loading="state.status === 'draft' && loading"
        @click="saveAsDraft"
      >
        {{ initialStatus === "draft" ? (isNewPage ? "Save as draft" : "Save changes") : "Save and unpublish" }}
      </UButton>
      <UButton
        class="w-full sm:w-auto flex items-center justify-center"
        :icon="initialStatus === 'draft' ? 'i-lucide-send' : 'i-lucide-save'"
        :loading="state.status === 'published' && loading"
        @click="saveAsPublished"
      >
        {{ initialStatus === "draft" ? "Save and publish" : "Save changes" }}
      </UButton>
    </div>
  </UForm>
</template>

<style scoped>

</style>
