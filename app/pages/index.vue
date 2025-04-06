<script setup lang="ts">
import { z } from "zod";

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
    console.error("Error saving page", e);
  }
  finally {
    loading.value = false;
  }
}

const schema = z.object({
  name: z.string().min(3).max(32),
  description: z.string().max(500).optional().nullable(),
  type: z.enum(["public", "administrative"]),
  public: z.boolean().optional()
});

const state = ref({

});

const formState = ref();

function submit(e) {
  console.log("submit", e);
  formState.value = e.data;
}

const fields: FormField = [
  {
    type: "input",
    name: "name",
    label: "Name",
    placeholder: "Jon Doe"
  },
  {
    type: "textarea",
    name: "description",
    label: "Description",
    placeholder: "Jon Doe is a great person"
  },
  {
    type: "select",
    name: "type",
    label: "Role type",
    placeholder: "Select a role type",
    valueKey: "id",
    items: [
      {
        id: "public",
        label: "Public"
      },
      {
        id: "administrative",
        label: "Administrative"
      }
    ]
  },
  {
    type: "switch",
    name: "public",
    label: "Public role",
    description: "Public roles are visible to everyone",
    class: "flex items-center justify-between gap-2"
  }
];
</script>

<template>
  <div class="centered">
    <UButton to="/admin">
      Admin
    </UButton>
    <UButton to="/memberships">
      Memberships
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

    <UCard>
      <SimpleForm
        :schema="schema"
        :state="state"
        :fields="fields"
        @submit="submit"
      />
      <pre>
        {{ formState }}
      </pre>
    </UCard>
  </div>
</template>

<style scoped>

</style>
