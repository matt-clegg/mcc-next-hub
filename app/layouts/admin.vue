<script setup lang="ts">
const route = useRoute();

const open = ref(false);

const links = [[{
  label: "Home",
  icon: "i-lucide-house",
  to: "/",
  onSelect: () => {
    open.value = false;
  }
}, {
  label: "Content",
  icon: "i-lucide-files",
  defaultOpen: true,
  children: [
    {
      label: "Pages",
      icon: "i-lucide-file-text",
      to: "/admin/content/pages",
      onSelect: () => {
        open.value = false;
      }
    },
    {
      label: "Navigation",
      icon: "i-lucide-folder-tree",
      to: "/admin/content/navigation",
      onSelect: () => {
        open.value = false;
      }
    }
  ]
  // onSelect: () => {
  //   open.value = false;
  // }
}
//   {
//   label: "Customers",
//   icon: "i-lucide-users",
//   to: "/customers",
//   onSelect: () => {
//     open.value = false;
//   }
// }, {
//   label: "Settings",
//   to: "/settings",
//   icon: "i-lucide-settings",
//   defaultOpen: true,
//   children: [{
//     label: "General",
//     to: "/settings",
//     exact: true,
//     onSelect: () => {
//       open.value = false;
//     }
//   }, {
//     label: "Members",
//     to: "/settings/members",
//     onSelect: () => {
//       open.value = false;
//     }
//   }, {
//     label: "Notifications",
//     to: "/settings/notifications",
//     onSelect: () => {
//       open.value = false;
//     }
//   }, {
//     label: "Security",
//     to: "/settings/security",
//     onSelect: () => {
//       open.value = false;
//     }
//   }]
// }
], [{
  label: "Feedback",
  icon: "i-lucide-message-circle",
  to: "https://github.com/nuxt-ui-pro/dashboard",
  target: "_blank"
}, {
  label: "Help & Support",
  icon: "i-lucide-info",
  to: "https://github.com/nuxt/ui-pro",
  target: "_blank"
}]];

const groups = computed(() => [{
  id: "links",
  label: "Go to",
  items: links.flat()
}, {
  id: "code",
  label: "Code",
  items: [{
    id: "source",
    label: "View page source",
    icon: "i-simple-icons-github",
    to: `https://github.com/nuxt-ui-pro/dashboard/blob/v3/app/pages${route.path === "/" ? "/index" : route.path}.vue`,
    target: "_blank"
  }]
}]);
</script>

<template>
  <UDashboardGroup>
    <UDashboardSearch :groups="groups" />

    <UDashboardSidebar
      v-model:open="open"
      collapsible
      resizable
      class="bg-(--ui-bg-elevated)/25"
      :ui="{ footer: 'lg:border-t lg:border-(--ui-border)' }"
    >
      <template #header="{ collapsed }">
        <NuxtImg
          src="/images/logo-no-text-blue.svg"
          class="w-auto h-8"
        />
        <!--        <TeamsMenu :collapsed="collapsed" /> -->
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-(--ui-border)" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <!--        <UserMenu :collapsed="collapsed" /> -->
      </template>
    </UDashboardSidebar>

    <slot />

    <!--    <NotificationsSlideover /> -->
  </UDashboardGroup>
</template>

<style scoped>

</style>
