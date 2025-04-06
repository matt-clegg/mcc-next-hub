<script setup lang="ts">
import { Sortable } from "sortablejs-vue3";

const props = defineProps<{
  navItems: AdminNavItem[];
}>();
</script>

<template>
  <div>
    <Sortable
      :list="navItems"
      :options="{
        group: 'nested',
        animation: 150,
        easing: 'cubic-bezier(1, 0, 0, 1)'
      }"
      item-key="id"
    >
      <template #item="{ element }">
        <div
          :key="element.id"
          class="cursor-move space-y-1"
        >
          <div class="flex align-center gap-1 bg-gray-100 py-1 px-2 rounded font-medium text-sm text-(-ui-text-muted)">
            <span class="flex justify-center items-center">
              <UIcon name="i-lucide-menu" class="size-4" />
            </span>
            <span>
              {{ element.name }}
            </span>
          </div>
          <AdminNavigationTree
            v-if="element.children"
            class="ml-4"
            :nav-items="element.children"
          />
        </div>
      </template>
    </Sortable>

    <!--    <draggable -->
    <!--      :list="navItems" -->
    <!--      :group="{ name: 'navigation', pull: true, put: true }" -->
    <!--      item-key="id" -->
    <!--      class="space-y-1" -->
    <!--      @end="handleUpdate" -->
    <!--    > -->
    <!--      <template #item="{ element }"> -->
    <!--        <div class=""> -->
    <!--          <div class="flex align-center gap-1 bg-gray-100 py-1 px-2 rounded-md font-medium text-sm text-(&#45;&#45;ui-text-muted) cursor-move"> -->
    <!--            <span class="flex justify-center items-center"> -->
    <!--              <UIcon name="i-lucide-menu" class="size-4" /> -->
    <!--            </span> -->
    <!--            <span>{{ element.name }}</span> -->
    <!--          </div> -->
    <!--          <AdminNavigationTree -->
    <!--            class="mt-1 ml-4 min-h-10 ring " -->
    <!--            :nav-items="element.children" -->
    <!--            @order-updated="handleChildOrderUpdate" -->
    <!--          /> -->
    <!--        </div> -->
    <!--      </template> -->
    <!--    </draggable> -->
  </div>
</template>
