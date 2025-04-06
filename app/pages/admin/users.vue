<script setup lang="ts">
definePageMeta({
  layout: "admin"
});

const links = [[{
  label: "Users",
  icon: "i-lucide-users",
  to: "/admin/users",
  exact: true
},
{
  label: "Roles",
  icon: "i-lucide-shield-user",
  to: "/admin/users/roles"
}
]];
</script>

<template>
  <AdminPage
    id="users-manager"
    title="User manager"
    :links="links"
  >
    <NuxtPage />
  </AdminPage>
</template>

<style scoped>

</style>
