<script setup lang="ts" generic="T extends object">
import type { FormSubmitEvent } from "@nuxt/ui";
import {
  UInput,
  UTextarea,
  USelect,
  USwitch
} from "#components";

const props = defineProps<{
  schema: unknown;
  state: T;
  loading?: boolean;
  fields: FormField[];
}>();

const emits = defineEmits<{
  submit: [FormSubmitEvent<any>];
}>();

const state = reactive<T>({
  ...props.state
});

function getFieldComponent(field: FormField) {
  switch (field.type) {
    case "input": return UInput;
    case "textarea": return UTextarea;
    case "select": return USelect;
    case "switch": return USwitch;
  }
}

function getComponentProps(field: FormField) {
  switch (field.type) {
    case "input":
      return {
        placeholder: field.placeholder
      };
    case "textarea":
      return {
        placeholder: field.placeholder,
        rows: field.rows ?? 5
      };
    case "select":
      return {
        placeholder: field.placeholder,
        valueKey: field.valueKey,
        items: field.items ?? []
      };
    case "switch":
      return {};
  }
}

async function onSubmit(event: FormSubmitEvent<unknown>) {
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
      v-for="field in fields"
      :key="field.name"
      :name="field.name"
      :description="field.description"
      :hint="field.hint"
      :help="field.help"
      :required="field.required"
      :error="field.error"
      :label="field.label"
      :class="field.class"
    >
      <component
        :is="getFieldComponent(field)"
        v-model="state[field.name]"
        v-bind="getComponentProps(field)"
        class="w-full"
      />
    </UFormField>

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
