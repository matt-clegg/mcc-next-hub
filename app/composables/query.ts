import { refDebounced } from "@vueuse/core";

export type SortConfig = {
  column: string;
  direction: "desc" | "asc";
};

export function useSort(defaults: SortConfig | undefined = undefined) {
  const sortConfig = ref<SortConfig | undefined>(defaults);

  const sortValue = computed(() => {
    if (!sortConfig.value?.column) {
      return undefined;
    }

    return (sortConfig.value.direction === "desc" ? "-" : "") + sortConfig.value.column;
  });

  return {
    sortConfig,
    sortValue
  };
}

export function useQuery(debounceMs: number = 500) {
  const q = ref();
  const qDebounced = refDebounced(q, debounceMs);

  return {
    q,
    qDebounced
  };
}
