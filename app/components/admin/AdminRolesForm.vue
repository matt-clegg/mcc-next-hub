<script setup lang="ts" generic="T extends Partial<Role>">
import type { FormSubmitEvent } from "@nuxt/ui";

const props = defineProps<{
  schema: unknown;
  state: T;
  loading: boolean;
}>();

const emits = defineEmits<{
  submit: [FormSubmitEvent<any>];
}>();

const state = reactive({
  ...props.state
});

function onSubmit(event: FormSubmitEvent<unknown>) {
  emits("submit", event);
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Name"
      name="name"
    >
      <UInput
        v-model="state.name"
        class="w-full"
      />
    </UFormField>

    <UFormField>
      <UTextarea
        v-model="state.description"
        class="w-full"
      />
    </UFormField>

    <UFormField />

    <div>
      <UButton
        type="submit"
        :loading="loading"
      >
        Submit
      </UButton>
    </div>
  </UForm>
</template>

<style scoped>

</style>
