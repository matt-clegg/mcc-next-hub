<script setup lang="ts">
const title = ref("");
const content = ref("");
const parent = ref("");

const loading = ref(false);

const page = ref();

async function onSave() {
  loading.value = true;
  try {
    page.value = await $fetch("/api/pages", {
      method: "POST",
      body: {
        title: title.value,
        content: content.value,
        parent: parent.value
      }
    });

    title.value = "";
    content.value = "";
    parent.value = "";
  }
  catch (e: any) {
    console.error("Error saving page");
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="centered">
    <UButton to="/admin">
      Admin
    </UButton>

    <UCard>
      <div>
        <UInput
          v-model="title"
          placeholder="Title"
        />
        <UInput
          v-model="content"
          placeholder="Content"
        />
        <UInput
          v-model="parent"
          placeholder="Parent"
        />
      </div>
      <UButton
        :loading="loading"
        @click="onSave"
      >
        Save
      </UButton>

      <pre>{{ page }}</pre>
    </UCard>
  </div>
</template>

<style scoped>

</style>
