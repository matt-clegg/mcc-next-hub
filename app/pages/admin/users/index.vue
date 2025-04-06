<script setup lang="ts">
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";

const table = useTemplateRef("table");

const columnFilters = ref([{
  id: "email",
  value: ""
}]);

const pagination = ref({
  pageIndex: 0,
  pageSize: 5
});

const { data, status } = await useDataList<User>("/api/admin/users", {
  lazy: true
});

const columnVisibility = ref();

const columns: TableColumn<User>[] = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "email",
    header: "Email"
  }
];
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-1.5">
      <UInput
        :model-value="(table?.tableApi?.getColumn('email')?.getFilterValue() as string)"
        class="max-w-sm"
        icon="i-lucide-search"
        placeholder="Filter emails..."
        @update:model-value="table?.tableApi?.getColumn('email')?.setFilterValue($event)"
      />

      <!--      <div class="flex flex-wrap items-center gap-1.5"> -->
      <!--        &lt;!&ndash;          <CustomersDeleteModal :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length"> &ndash;&gt; -->
      <!--        &lt;!&ndash;            <UButton &ndash;&gt; -->
      <!--        &lt;!&ndash;              v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length" &ndash;&gt; -->
      <!--        &lt;!&ndash;              label="Delete" &ndash;&gt; -->
      <!--        &lt;!&ndash;              color="error" &ndash;&gt; -->
      <!--        &lt;!&ndash;              variant="subtle" &ndash;&gt; -->
      <!--        &lt;!&ndash;              icon="i-lucide-trash" &ndash;&gt; -->
      <!--        &lt;!&ndash;            > &ndash;&gt; -->
      <!--        &lt;!&ndash;              <template #trailing> &ndash;&gt; -->
      <!--        &lt;!&ndash;                <UKbd> &ndash;&gt; -->
      <!--        &lt;!&ndash;                  {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }} &ndash;&gt; -->
      <!--        &lt;!&ndash;                </UKbd> &ndash;&gt; -->
      <!--        &lt;!&ndash;              </template> &ndash;&gt; -->
      <!--        &lt;!&ndash;            </UButton> &ndash;&gt; -->
      <!--        &lt;!&ndash;          </CustomersDeleteModal> &ndash;&gt; -->

      <!--        <USelect -->
      <!--          v-model="statusFilter" -->
      <!--          :items="[ -->
      <!--            { label: 'All', value: 'all' }, -->
      <!--            { label: 'Subscribed', value: 'subscribed' }, -->
      <!--            { label: 'Unsubscribed', value: 'unsubscribed' }, -->
      <!--            { label: 'Bounced', value: 'bounced' } -->
      <!--          ]" -->
      <!--          :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }" -->
      <!--          placeholder="Filter status" -->
      <!--          class="min-w-28" -->
      <!--        /> -->
      <!--        <UDropdownMenu -->
      <!--          :items=" -->
      <!--            table?.tableApi -->
      <!--              ?.getAllColumns() -->
      <!--              .filter((column) => column.getCanHide()) -->
      <!--              .map((column) => ({ -->
      <!--                label: upperFirst(column.id), -->
      <!--                type: 'checkbox' as const, -->
      <!--                checked: column.getIsVisible(), -->
      <!--                onUpdateChecked(checked: boolean) { -->
      <!--                  table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked) -->
      <!--                }, -->
      <!--                onSelect(e?: Event) { -->
      <!--                  e?.preventDefault() -->
      <!--                } -->
      <!--              })) -->
      <!--          " -->
      <!--          :content="{ align: 'end' }" -->
      <!--        > -->
      <!--          <UButton -->
      <!--            label="Display" -->
      <!--            color="neutral" -->
      <!--            variant="outline" -->
      <!--            trailing-icon="i-lucide-settings-2" -->
      <!--          /> -->
      <!--        </UDropdownMenu> -->
      <!--      </div> -->
    </div>

    <UTable
      ref="table"
      v-model:column-filters="columnFilters"
      v-model:column-visibility="columnVisibility"
      v-model:pagination="pagination"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
      class="shrink-0"
      :data="data"
      :columns="columns"
      :loading="status === 'pending'"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-1 first:rounded-l-[calc(var(--ui-radius)*2)] last:rounded-r-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r',
        td: 'border-b border-(--ui-border)'
      }"
    />

    <div class="flex items-center justify-between gap-3 border-t border-(--ui-border) pt-4 mt-auto">
      <div class="text-sm text-(--ui-text-muted)">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
      </div>

      <div class="flex items-center gap-1.5">
        <UPagination
          :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
