import type { AsyncDataRequestStatus } from "#app";
import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";

export type DataListOptions = {
  q?: Ref<string>;
  page?: Ref<number>;
  limit?: Ref<number>;
  sort?: Ref<string | undefined>;
  fields?: Ref<string[]>;
  lazy?: boolean;
};

export type DataListResult<T> = {
  status: Ref<AsyncDataRequestStatus>;
  refresh: (opts?: AsyncDataExecuteOptions) => Promise<void>;
  data: ComputedRef<T[]>;
  count: ComputedRef<number>;
};

export async function useDataList<T>(url: string, opts: DataListOptions = {}): Promise<DataListResult<T>> {
  const query = computed(() => ({
    q: opts.q?.value ?? undefined,
    page: opts.page?.value ?? undefined,
    limit: opts.limit?.value ?? undefined,
    sort: opts.sort?.value ?? undefined,
    fields: opts.fields?.value ?? undefined
  }));

  const { data, status, refresh } = await useFetch<Paginated<T[]>>(url, {
    query,
    deep: false,
    lazy: opts.lazy,
    default: () => ({ data: [], count: 0 }),
    onResponseError({ error }) {
      handleFetchError(error);
    }
  });

  const result = computed(() => data.value.data);
  const count = computed(() => data.value.count);

  return {
    status,
    refresh,
    data: result,
    count
  };
}
