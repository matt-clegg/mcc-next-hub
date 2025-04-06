<script setup lang="ts">
const items = ref([
  {
    id: "abc",
    name: "Foo",
    order: 0,
    children: []
  },
  {
    id: "123",
    name: "Bar",
    order: 1,
    children: [
      {
        id: "asgdfg",
        name: "Child 1",
        order: 0,
        children: []
      },
      {
        id: "dghdh",
        name: "Child 2",
        order: 1,
        children: []
      }
    ]
  }
]);
</script>

<template>
  <UPageCard>
    <AdminNavigationTree v-model:nav-items="items" />
    <pre>
      {{ items }}
    </pre>
  </UPageCard>
</template>

<style scoped>

</style>
