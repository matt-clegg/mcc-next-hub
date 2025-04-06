<script setup lang="ts">
const emits = defineEmits<{ close: [boolean] }>();

const {
  dismissLabel = "Cancel",
  okLabel = "Ok"
} = defineProps<{
  title: string;
  description?: string;
  bodyText?: string;
  dismissLabel?: string;
  okLabel?: string;
}>();
</script>

<template>
  <UModal
    :title="title"
    :description="description"
  >
    <template
      v-if="bodyText"
      #body
    >
      {{ bodyText }}
    </template>
    <template #footer>
      <div class="flex gap-2">
        <UButton
          color="neutral"
          :label="dismissLabel"
          @click="emits('close', false)"
        />
        <UButton
          color="primary"
          :label="okLabel"
          @click="emits('close', true)"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>
